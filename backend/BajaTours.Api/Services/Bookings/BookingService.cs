using System.Security.Cryptography;
using BajaTours.Api.Configuration;
using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Bookings;
using BajaTours.Api.Services.Availability;
using BajaTours.Api.Services.Coupons;
using BajaTours.Api.Services.Notifications;
using BajaTours.Api.Services.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BajaTours.Api.Services.Bookings;

public interface IBookingService
{
    Task<CreateBookingResponse> CreateAsync(Guid userId, CreateBookingRequest req, CancellationToken ct);
    Task<BookingDto> GetAsync(Guid userId, UserRole role, Guid bookingId, CancellationToken ct);
    Task<IReadOnlyList<BookingDto>> ListForUserAsync(Guid userId, CancellationToken ct);
    Task<BookingDto> CancelAsync(Guid userId, UserRole role, Guid bookingId, CancelBookingRequest req, CancellationToken ct);
    Task<BookingDto?> MarkPaymentResultAsync(Guid bookingId, MercadoPagoPaymentInfo info, CancellationToken ct);
}

public class BookingService : IBookingService
{
    private static readonly string ReferenceAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private readonly AppDbContext _db;
    private readonly IMercadoPagoService _mp;
    private readonly IEmailService _email;
    private readonly ICouponsService _coupons;
    private readonly IAvailabilityService _availability;
    private readonly PaymentsOptions _payments;
    private readonly ILogger<BookingService> _logger;

    public BookingService(
        AppDbContext db,
        IMercadoPagoService mp,
        IEmailService email,
        ICouponsService coupons,
        IAvailabilityService availability,
        IOptions<PaymentsOptions> payments,
        ILogger<BookingService> logger)
    {
        _db = db;
        _mp = mp;
        _email = email;
        _coupons = coupons;
        _availability = availability;
        _payments = payments.Value;
        _logger = logger;
    }

    public async Task<CreateBookingResponse> CreateAsync(Guid userId, CreateBookingRequest req, CancellationToken ct)
    {
        if (req.Adults + req.Children <= 0)
            throw new BookingException(BookingError.InvalidGuestCount, "At least one guest is required.");

        var tour = await _db.Tours
            .Include(t => t.Provider)
            .Include(t => t.Images)
            .FirstOrDefaultAsync(t => t.Id == req.TourId, ct)
            ?? throw new BookingException(BookingError.TourNotFound, "Tour not found.");

        if (tour.Status != TourStatus.Active)
            throw new BookingException(BookingError.TourNotBookable, "Tour is not currently bookable.");

        if (req.Adults + req.Children > tour.MaxGuests)
            throw new BookingException(BookingError.InvalidGuestCount, $"Maximum {tour.MaxGuests} guests per booking.");

        // Availability gate: if the provider has configured per-date availability for this
        // tour, the booking must land on a date with remaining capacity. Atomic reservation
        // (Booked + guests <= Capacity) happens at SQL level. Tours without any configured
        // availability fall through to legacy MaxGuests-only behavior — opt-in per provider.
        var guests = req.Adults + req.Children;
        TourAvailability? reservedSlot = null;
        var hasConfig = await _availability.AnyConfiguredAsync(tour.Id, ct);
        if (hasConfig)
        {
            reservedSlot = await _availability.TryReserveAsync(tour.Id, req.Date, guests, ct);
            if (reservedSlot is null)
                throw new BookingException(BookingError.InvalidGuestCount,
                    "Esa fecha no tiene cupo disponible para este tour.");
        }

        // Honor per-date price override without mutating the tracked Tour entity
        var effectivePriceAdult = reservedSlot?.PriceOverride ?? tour.PriceAdult;
        var adultsTotal = req.Adults * effectivePriceAdult;
        var childrenTotal = req.Children * (tour.PriceChild ?? 0m);
        var subtotal = adultsTotal + childrenTotal;

        // Resolve coupon (if any) BEFORE saving so we apply the correct discount.
        // The atomic Redeemed++ happens after the booking row exists, to avoid
        // burning a redemption on a booking we couldn't save.
        decimal discount = 0m;
        string? appliedCouponCode = null;
        Guid? couponIdToRedeem = null;
        if (!string.IsNullOrWhiteSpace(req.CouponCode))
        {
            CouponEvaluation eval;
            try
            {
                eval = await _coupons.EvaluateForBookingAsync(req.CouponCode!, subtotal, ct);
            }
            catch (CouponException ex)
            {
                throw new BookingException(BookingError.CouponNotApplicable, ex.Message);
            }
            discount = eval.AppliedDiscount;
            appliedCouponCode = eval.Coupon.Code;
            couponIdToRedeem = eval.Coupon.Id;
        }

        var total = Math.Max(0m, subtotal - discount);
        var commission = Math.Round(total * tour.Provider.CommissionRate, 2);

        var booking = new Booking
        {
            Reference = NewReference(),
            UserId = userId,
            TourId = tour.Id,
            Date = req.Date,
            StartTime = req.StartTime,
            Adults = req.Adults,
            Children = req.Children,
            Subtotal = subtotal,
            DiscountAmount = discount,
            CommissionAmount = commission,
            TotalPrice = total,
            Currency = "MXN",
            CouponCode = appliedCouponCode,
            ContactName = req.ContactName.Trim(),
            ContactEmail = req.ContactEmail.Trim().ToLowerInvariant(),
            ContactPhone = req.ContactPhone,
            Notes = req.Notes,
            Status = BookingStatus.Pending
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync(ct);

        // Atomic redemption — gates re-checked at the SQL level. If it lost the race,
        // we keep the booking but log the discrepancy; the customer keeps the discount
        // they were promised. (Operationally rare; alternative is to roll back the booking.)
        if (couponIdToRedeem is { } cid)
        {
            var redeemed = await _coupons.TryRedeemAsync(cid, ct);
            if (!redeemed)
                _logger.LogWarning("Coupon {Code} could not be redeemed for booking {BookingId} — race or expiry", appliedCouponCode, booking.Id);
        }

        var preference = await _mp.CreatePreferenceAsync(booking, tour, ct);

        _db.Payments.Add(new Payment
        {
            BookingId = booking.Id,
            Provider = PaymentProvider.MercadoPago,
            Status = PaymentStatus.Pending,
            ProviderPreferenceId = preference.PreferenceId,
            Amount = booking.TotalPrice,
            Currency = booking.Currency
        });
        await _db.SaveChangesAsync(ct);

        var dto = await BuildDtoAsync(booking.Id, ct);
        return new CreateBookingResponse(dto!, preference.PreferenceId, preference.InitPoint, preference.SandboxInitPoint);
    }

    public async Task<BookingDto> GetAsync(Guid userId, UserRole role, Guid bookingId, CancellationToken ct)
    {
        var dto = await BuildDtoAsync(bookingId, ct);
        if (dto is null)
            throw new BookingException(BookingError.BookingNotFound, "Booking not found.");

        if (role != UserRole.Admin)
        {
            var ownerId = await _db.Bookings.Where(b => b.Id == bookingId)
                .Select(b => (Guid?)b.UserId).FirstOrDefaultAsync(ct);
            if (ownerId != userId)
                throw new BookingException(BookingError.NotAuthorized, "You cannot view this booking.");
        }

        return dto;
    }

    public async Task<IReadOnlyList<BookingDto>> ListForUserAsync(Guid userId, CancellationToken ct)
    {
        var ids = await _db.Bookings
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => b.Id)
            .ToListAsync(ct);

        var list = new List<BookingDto>(ids.Count);
        foreach (var id in ids)
        {
            var dto = await BuildDtoAsync(id, ct);
            if (dto is not null) list.Add(dto);
        }
        return list;
    }

    public async Task<BookingDto> CancelAsync(Guid userId, UserRole role, Guid bookingId, CancelBookingRequest req, CancellationToken ct)
    {
        var booking = await _db.Bookings
            .Include(b => b.Payment)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct)
            ?? throw new BookingException(BookingError.BookingNotFound, "Booking not found.");

        if (role != UserRole.Admin && booking.UserId != userId)
            throw new BookingException(BookingError.NotAuthorized, "You cannot cancel this booking.");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var cancellable = booking.Status == BookingStatus.Pending
            || (booking.Status == BookingStatus.Confirmed && booking.Date >= today);
        if (!cancellable)
            throw new BookingException(BookingError.NotCancellable, "Booking is not in a cancellable state.");

        // Refund first. If MP rejects, surface as error and leave DB state untouched
        // so the user can retry. We only refund when there's an approved payment with
        // a provider-issued ID — Pending/already-Refunded payments are skipped.
        var payment = booking.Payment;
        var shouldRefund = payment is { Status: PaymentStatus.Approved }
            && !string.IsNullOrWhiteSpace(payment.ProviderPaymentId);

        if (shouldRefund)
        {
            try
            {
                await _mp.RefundPaymentAsync(payment!.ProviderPaymentId!, booking.TotalPrice, ct);
            }
            catch (Exception ex)
            {
                throw new BookingException(BookingError.RefundFailed,
                    $"Mercado Pago refund failed: {ex.Message}");
            }

            payment!.Status = PaymentStatus.Refunded;
            payment.UpdatedAt = DateTime.UtcNow;
        }

        booking.Status = BookingStatus.Cancelled;
        booking.CancelledAt = DateTime.UtcNow;
        booking.CancelReason = req.Reason.Trim();
        booking.CancelComment = string.IsNullOrWhiteSpace(req.Comment) ? null : req.Comment.Trim();
        booking.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        // Free the seat back into the per-date pool (no-op if the date had no availability row)
        await _availability.ReleaseAsync(booking.TourId, booking.Date, booking.Adults + booking.Children, ct);

        await SendBookingCancelledEmailsAsync(booking.Id, refunded: shouldRefund, ct);

        return await BuildDtoAsync(booking.Id, ct)
            ?? throw new BookingException(BookingError.BookingNotFound, "Booking disappeared during cancel.");
    }

    public async Task<BookingDto?> MarkPaymentResultAsync(Guid bookingId, MercadoPagoPaymentInfo info, CancellationToken ct)
    {
        var booking = await _db.Bookings
            .Include(b => b.Payment)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct);
        if (booking is null) return null;

        var paymentStatus = info.Status switch
        {
            "approved" => PaymentStatus.Approved,
            "pending" => PaymentStatus.Pending,
            "in_process" => PaymentStatus.Processing,
            "rejected" => PaymentStatus.Rejected,
            "cancelled" => PaymentStatus.Rejected,
            "refunded" => PaymentStatus.Refunded,
            "charged_back" => PaymentStatus.Refunded,
            _ => PaymentStatus.Pending
        };

        var payment = booking.Payment ?? new Payment
        {
            BookingId = booking.Id,
            Provider = PaymentProvider.MercadoPago,
            Amount = booking.TotalPrice,
            Currency = booking.Currency
        };

        payment.ProviderPaymentId = info.ProviderPaymentId;
        payment.Status = paymentStatus;
        payment.RawPayload = info.RawJson;
        payment.UpdatedAt = DateTime.UtcNow;

        if (booking.Payment is null) _db.Payments.Add(payment);

        var previousStatus = booking.Status;
        booking.Status = paymentStatus switch
        {
            PaymentStatus.Approved => BookingStatus.Confirmed,
            PaymentStatus.Rejected => BookingStatus.Cancelled,
            PaymentStatus.Refunded => BookingStatus.Cancelled,
            _ => BookingStatus.Pending
        };
        booking.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        // Send booking-confirmed emails when transitioning into Confirmed.
        if (booking.Status == BookingStatus.Confirmed && previousStatus != BookingStatus.Confirmed)
        {
            await SendBookingConfirmedEmailsAsync(booking.Id, ct);
        }

        return await BuildDtoAsync(booking.Id, ct);
    }

    private async Task SendBookingConfirmedEmailsAsync(Guid bookingId, CancellationToken ct)
    {
        var hydrated = await _db.Bookings
            .AsNoTracking()
            .Include(b => b.Tour).ThenInclude(t => t.Provider).ThenInclude(p => p.User)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct);
        if (hydrated is null) return;

        var frontend = _payments.FrontendBaseUrl;
        try
        {
            await _email.SendAsync(EmailTemplates.BookingConfirmedToCustomer(hydrated, hydrated.Tour, hydrated.Tour.Provider, frontend), ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send booking-confirmed email to customer for booking {BookingId}", bookingId);
        }

        try
        {
            await _email.SendAsync(EmailTemplates.BookingConfirmedToProvider(hydrated, hydrated.Tour, hydrated.Tour.Provider, hydrated.Tour.Provider.User, frontend), ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send booking-confirmed email to provider for booking {BookingId}", bookingId);
        }
    }

    private async Task SendBookingCancelledEmailsAsync(Guid bookingId, bool refunded, CancellationToken ct)
    {
        var hydrated = await _db.Bookings
            .AsNoTracking()
            .Include(b => b.Tour).ThenInclude(t => t.Provider).ThenInclude(p => p.User)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct);
        if (hydrated is null) return;

        try
        {
            await _email.SendAsync(EmailTemplates.BookingCancelledToCustomer(hydrated, hydrated.Tour, hydrated.Tour.Provider, refunded), ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send booking-cancelled email to customer for booking {BookingId}", bookingId);
        }

        try
        {
            await _email.SendAsync(EmailTemplates.BookingCancelledToProvider(hydrated, hydrated.Tour, hydrated.Tour.Provider, hydrated.Tour.Provider.User, refunded), ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send booking-cancelled email to provider for booking {BookingId}", bookingId);
        }
    }

    private async Task<BookingDto?> BuildDtoAsync(Guid id, CancellationToken ct)
    {
        var b = await _db.Bookings.AsNoTracking()
            .Include(b => b.Tour).ThenInclude(t => t.Provider)
            .Include(b => b.Tour).ThenInclude(t => t.Images)
            .Include(b => b.Payment)
            .FirstOrDefaultAsync(b => b.Id == id, ct);
        if (b is null) return null;

        var cover = b.Tour.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault();
        var tourSummary = new TourSummaryDto(
            b.Tour.Id, b.Tour.Slug, b.Tour.Title, b.Tour.Location, b.Tour.Duration, cover, b.Tour.Provider.CompanyName);

        var paymentDto = b.Payment is null
            ? null
            : new PaymentSummaryDto(b.Payment.Provider, b.Payment.Status, b.Payment.ProviderPaymentId);

        return new BookingDto(
            b.Id, b.Reference, b.Status, b.Date, b.StartTime, b.Adults, b.Children,
            b.Subtotal, b.DiscountAmount, b.CommissionAmount, b.TotalPrice, b.Currency,
            b.ContactName, b.ContactEmail, b.ContactPhone, b.Notes, b.CreatedAt,
            tourSummary, paymentDto);
    }

    private static string NewReference()
    {
        Span<byte> bytes = stackalloc byte[6];
        RandomNumberGenerator.Fill(bytes);
        Span<char> chars = stackalloc char[10];
        chars[0] = 'B'; chars[1] = 'J'; chars[2] = 'A'; chars[3] = '-';
        for (var i = 0; i < 6; i++)
            chars[4 + i] = ReferenceAlphabet[bytes[i] % ReferenceAlphabet.Length];
        return new string(chars);
    }
}

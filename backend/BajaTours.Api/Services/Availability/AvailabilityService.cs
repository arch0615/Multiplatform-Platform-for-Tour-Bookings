using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.DTOs.Availability;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Services.Availability;

public enum AvailabilityError
{
    None = 0,
    TourNotFound,
    NotProvider,
    NotOwner,
    NotEnoughCapacity,
}

public class AvailabilityException : Exception
{
    public AvailabilityError Error { get; }
    public AvailabilityException(AvailabilityError error, string message) : base(message) => Error = error;
}

public interface IAvailabilityService
{
    Task<IReadOnlyList<AvailabilityWindowDto>> GetForProviderAsync(Guid userId, Guid tourId, DateOnly? from, DateOnly? to, CancellationToken ct);
    Task<IReadOnlyList<AvailabilityWindowDto>> BulkUpsertAsync(Guid userId, Guid tourId, IReadOnlyList<WriteAvailabilityItem> items, CancellationToken ct);
    Task<IReadOnlyList<PublicAvailabilitySlotDto>> GetPublicForSlugAsync(string slug, string? monthYyyyMM, CancellationToken ct);

    /// <summary>True if the tour has any availability rows configured.</summary>
    Task<bool> AnyConfiguredAsync(Guid tourId, CancellationToken ct);

    /// <summary>Atomically increment Booked on the (TourId, Date) row by `guests`.
    /// Returns the affected row, or null if no row matched the gating WHERE clause
    /// (i.e. capacity exhausted or no availability configured for that date).</summary>
    Task<TourAvailability?> TryReserveAsync(Guid tourId, DateOnly date, int guests, CancellationToken ct);

    /// <summary>Release a previously-reserved capacity slot (used on cancel/refund).</summary>
    Task ReleaseAsync(Guid tourId, DateOnly date, int guests, CancellationToken ct);
}

public class AvailabilityService : IAvailabilityService
{
    private readonly AppDbContext _db;
    private readonly ILogger<AvailabilityService> _logger;

    public AvailabilityService(AppDbContext db, ILogger<AvailabilityService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IReadOnlyList<AvailabilityWindowDto>> GetForProviderAsync(
        Guid userId, Guid tourId, DateOnly? from, DateOnly? to, CancellationToken ct)
    {
        await EnsureOwnerAsync(userId, tourId, ct);

        var query = _db.TourAvailability.AsNoTracking().Where(a => a.TourId == tourId);
        if (from is { } f) query = query.Where(a => a.Date >= f);
        if (to is { } t) query = query.Where(a => a.Date <= t);

        return await query
            .OrderBy(a => a.Date).ThenBy(a => a.StartTime)
            .Select(a => new AvailabilityWindowDto(
                a.Id, a.Date, a.StartTime, a.Capacity, a.Booked,
                Math.Max(0, a.Capacity - a.Booked), a.PriceOverride))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<AvailabilityWindowDto>> BulkUpsertAsync(
        Guid userId, Guid tourId, IReadOnlyList<WriteAvailabilityItem> items, CancellationToken ct)
    {
        await EnsureOwnerAsync(userId, tourId, ct);

        // Read existing rows for the dates being touched. Unique index is on (TourId, Date),
        // so one row per date — easy mapping.
        var targetDates = items.Select(i => i.Date).Distinct().ToList();
        var existing = await _db.TourAvailability
            .Where(a => a.TourId == tourId && targetDates.Contains(a.Date))
            .ToDictionaryAsync(a => a.Date, ct);

        foreach (var item in items)
        {
            if (existing.TryGetValue(item.Date, out var row))
            {
                // Never let an admin/provider set Capacity below already-Booked.
                row.Capacity = Math.Max(item.Capacity, row.Booked);
                row.StartTime = item.StartTime;
                row.PriceOverride = item.PriceOverride;
            }
            else
            {
                _db.TourAvailability.Add(new TourAvailability
                {
                    TourId = tourId,
                    Date = item.Date,
                    StartTime = item.StartTime,
                    Capacity = item.Capacity,
                    Booked = 0,
                    PriceOverride = item.PriceOverride,
                });
            }
        }

        await _db.SaveChangesAsync(ct);
        return await GetForProviderAsync(userId, tourId,
            items.Min(i => i.Date), items.Max(i => i.Date), ct);
    }

    public async Task<IReadOnlyList<PublicAvailabilitySlotDto>> GetPublicForSlugAsync(
        string slug, string? monthYyyyMM, CancellationToken ct)
    {
        var tourId = await _db.Tours
            .Where(t => t.Slug == slug)
            .Select(t => (Guid?)t.Id).FirstOrDefaultAsync(ct);
        if (tourId is null)
            throw new AvailabilityException(AvailabilityError.TourNotFound, "Tour not found.");

        var query = _db.TourAvailability.AsNoTracking().Where(a => a.TourId == tourId);

        // Default window: today → +180 days. With a month filter, restrict to that month.
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (TryParseYearMonth(monthYyyyMM, out var y, out var m))
        {
            var from = new DateOnly(y, m, 1);
            var to = from.AddMonths(1).AddDays(-1);
            query = query.Where(a => a.Date >= from && a.Date <= to);
        }
        else
        {
            query = query.Where(a => a.Date >= today && a.Date <= today.AddDays(180));
        }

        return await query
            .Where(a => a.Capacity > a.Booked)
            .OrderBy(a => a.Date).ThenBy(a => a.StartTime)
            .Select(a => new PublicAvailabilitySlotDto(
                a.Date, a.StartTime,
                Math.Max(0, a.Capacity - a.Booked),
                a.PriceOverride))
            .ToListAsync(ct);
    }

    public async Task<bool> AnyConfiguredAsync(Guid tourId, CancellationToken ct)
        => await _db.TourAvailability.AnyAsync(a => a.TourId == tourId, ct);

    public async Task<TourAvailability?> TryReserveAsync(Guid tourId, DateOnly date, int guests, CancellationToken ct)
    {
        if (guests <= 0) return null;

        // Atomic UPDATE with re-checked capacity in the WHERE clause.
        var affected = await _db.TourAvailability
            .Where(a => a.TourId == tourId && a.Date == date && a.Booked + guests <= a.Capacity)
            .ExecuteUpdateAsync(setters => setters.SetProperty(a => a.Booked, a => a.Booked + guests), ct);

        if (affected == 0)
        {
            _logger.LogInformation("Reservation of {Guests} guests on {TourId}/{Date} rejected — capacity exhausted or no row", guests, tourId, date);
            return null;
        }

        return await _db.TourAvailability.AsNoTracking()
            .FirstOrDefaultAsync(a => a.TourId == tourId && a.Date == date, ct);
    }

    public async Task ReleaseAsync(Guid tourId, DateOnly date, int guests, CancellationToken ct)
    {
        if (guests <= 0) return;
        // Ternary translates to SQL CASE; Math.Max is not always supported in ExecuteUpdate.
        await _db.TourAvailability
            .Where(a => a.TourId == tourId && a.Date == date)
            .ExecuteUpdateAsync(setters =>
                setters.SetProperty(a => a.Booked, a => a.Booked - guests > 0 ? a.Booked - guests : 0),
                ct);
    }

    // ---------- helpers ----------

    private async Task EnsureOwnerAsync(Guid userId, Guid tourId, CancellationToken ct)
    {
        var providerId = await _db.Providers
            .Where(p => p.UserId == userId).Select(p => (Guid?)p.Id).FirstOrDefaultAsync(ct);
        if (providerId is null)
            throw new AvailabilityException(AvailabilityError.NotProvider, "Caller is not a provider.");

        var ownerOk = await _db.Tours.AnyAsync(t => t.Id == tourId && t.ProviderId == providerId, ct);
        if (!ownerOk)
        {
            var tourExists = await _db.Tours.AnyAsync(t => t.Id == tourId, ct);
            if (!tourExists) throw new AvailabilityException(AvailabilityError.TourNotFound, "Tour not found.");
            throw new AvailabilityException(AvailabilityError.NotOwner, "You do not own this tour.");
        }
    }

    private static bool TryParseYearMonth(string? s, out int year, out int month)
    {
        year = 0; month = 0;
        if (string.IsNullOrWhiteSpace(s)) return false;
        var parts = s.Split('-');
        if (parts.Length != 2) return false;
        return int.TryParse(parts[0], out year)
            && int.TryParse(parts[1], out month)
            && month >= 1 && month <= 12;
    }
}

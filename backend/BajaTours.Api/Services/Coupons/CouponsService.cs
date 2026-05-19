using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.DTOs.Coupons;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Services.Coupons;

public enum CouponError
{
    None = 0,
    NotFound,
    DuplicateCode,
    Inactive,
    OutsideWindow,
    RedemptionsExhausted,
    InvalidConfig,
}

public class CouponException : Exception
{
    public CouponError Error { get; }
    public CouponException(CouponError error, string message) : base(message) => Error = error;
}

public record CouponEvaluation(Coupon Coupon, decimal AppliedDiscount);

public interface ICouponsService
{
    Task<ValidateCouponResponse> ValidateForPreviewAsync(string code, decimal subtotal, CancellationToken ct);

    /// <summary>Used by BookingService when a coupon code is supplied at booking creation.</summary>
    Task<CouponEvaluation> EvaluateForBookingAsync(string code, decimal subtotal, CancellationToken ct);

    /// <summary>Atomic redemption: increments Redeemed if all gating conditions still hold.</summary>
    Task<bool> TryRedeemAsync(Guid couponId, CancellationToken ct);

    // Admin CRUD
    Task<IReadOnlyList<CouponDto>> ListAsync(CancellationToken ct);
    Task<CouponDto> GetAsync(Guid id, CancellationToken ct);
    Task<CouponDto> CreateAsync(WriteCouponRequest req, CancellationToken ct);
    Task<CouponDto> UpdateAsync(Guid id, WriteCouponRequest req, CancellationToken ct);
    Task<CouponDto> ArchiveAsync(Guid id, CancellationToken ct);
}

public class CouponsService : ICouponsService
{
    private readonly AppDbContext _db;
    private readonly ILogger<CouponsService> _logger;

    public CouponsService(AppDbContext db, ILogger<CouponsService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<ValidateCouponResponse> ValidateForPreviewAsync(string code, decimal subtotal, CancellationToken ct)
    {
        var normalized = code.Trim().ToUpperInvariant();
        var coupon = await _db.Coupons.AsNoTracking().FirstOrDefaultAsync(c => c.Code == normalized, ct);
        if (coupon is null)
            return new ValidateCouponResponse(false, "NOT_FOUND", normalized, null, 0, null, 0, subtotal);

        var (ok, reason) = CheckGate(coupon);
        if (!ok)
            return new ValidateCouponResponse(false, reason, coupon.Code, coupon.Description,
                coupon.DiscountPercent, coupon.DiscountAmount, 0, subtotal);

        var discount = ComputeDiscount(coupon, subtotal);
        var newTotal = Math.Max(0m, subtotal - discount);
        return new ValidateCouponResponse(true, null, coupon.Code, coupon.Description,
            coupon.DiscountPercent, coupon.DiscountAmount, discount, newTotal);
    }

    public async Task<CouponEvaluation> EvaluateForBookingAsync(string code, decimal subtotal, CancellationToken ct)
    {
        var normalized = code.Trim().ToUpperInvariant();
        var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code == normalized, ct)
            ?? throw new CouponException(CouponError.NotFound, "Coupon not found.");

        var (ok, reason) = CheckGate(coupon);
        if (!ok)
        {
            var err = reason switch
            {
                "INACTIVE" => CouponError.Inactive,
                "OUTSIDE_WINDOW" => CouponError.OutsideWindow,
                "REDEMPTIONS_EXHAUSTED" => CouponError.RedemptionsExhausted,
                _ => CouponError.InvalidConfig
            };
            throw new CouponException(err, $"Coupon not applicable: {reason}.");
        }

        var discount = ComputeDiscount(coupon, subtotal);
        return new CouponEvaluation(coupon, discount);
    }

    public async Task<bool> TryRedeemAsync(Guid couponId, CancellationToken ct)
    {
        // Atomic increment with the same gates re-checked at write time.
        // EF's ExecuteUpdate translates to a single UPDATE … WHERE … statement;
        // SQL Server's row lock during the update protects against the read-modify-write race.
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var affected = await _db.Coupons
            .Where(c => c.Id == couponId
                && c.Active
                && (c.ValidFrom == null || c.ValidFrom <= today)
                && (c.ValidUntil == null || c.ValidUntil >= today)
                && (c.MaxRedemptions == null || c.Redeemed < c.MaxRedemptions))
            .ExecuteUpdateAsync(setters => setters.SetProperty(c => c.Redeemed, c => c.Redeemed + 1), ct);

        if (affected == 0)
            _logger.LogWarning("Coupon {CouponId} could not be redeemed (raced or invalid)", couponId);
        return affected > 0;
    }

    public async Task<IReadOnlyList<CouponDto>> ListAsync(CancellationToken ct)
    {
        return await _db.Coupons.AsNoTracking()
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => ToDto(c))
            .ToListAsync(ct);
    }

    public async Task<CouponDto> GetAsync(Guid id, CancellationToken ct)
    {
        var c = await _db.Coupons.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, ct)
            ?? throw new CouponException(CouponError.NotFound, "Coupon not found.");
        return ToDto(c);
    }

    public async Task<CouponDto> CreateAsync(WriteCouponRequest req, CancellationToken ct)
    {
        ValidateConfig(req);
        var code = req.Code.Trim().ToUpperInvariant();
        var exists = await _db.Coupons.AnyAsync(c => c.Code == code, ct);
        if (exists) throw new CouponException(CouponError.DuplicateCode, "A coupon with that code already exists.");

        var c = new Coupon
        {
            Code = code,
            Description = req.Description?.Trim(),
            DiscountPercent = req.DiscountPercent,
            DiscountAmount = req.DiscountAmount,
            ValidFrom = req.ValidFrom,
            ValidUntil = req.ValidUntil,
            MaxRedemptions = req.MaxRedemptions,
            Active = req.Active,
        };
        _db.Coupons.Add(c);
        await _db.SaveChangesAsync(ct);
        return ToDto(c);
    }

    public async Task<CouponDto> UpdateAsync(Guid id, WriteCouponRequest req, CancellationToken ct)
    {
        ValidateConfig(req);
        var c = await _db.Coupons.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new CouponException(CouponError.NotFound, "Coupon not found.");

        var newCode = req.Code.Trim().ToUpperInvariant();
        if (newCode != c.Code)
        {
            var clash = await _db.Coupons.AnyAsync(x => x.Code == newCode && x.Id != id, ct);
            if (clash) throw new CouponException(CouponError.DuplicateCode, "Another coupon already uses that code.");
            c.Code = newCode;
        }

        c.Description = req.Description?.Trim();
        c.DiscountPercent = req.DiscountPercent;
        c.DiscountAmount = req.DiscountAmount;
        c.ValidFrom = req.ValidFrom;
        c.ValidUntil = req.ValidUntil;
        c.MaxRedemptions = req.MaxRedemptions;
        c.Active = req.Active;
        await _db.SaveChangesAsync(ct);
        return ToDto(c);
    }

    public async Task<CouponDto> ArchiveAsync(Guid id, CancellationToken ct)
    {
        var c = await _db.Coupons.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new CouponException(CouponError.NotFound, "Coupon not found.");
        c.Active = false;
        await _db.SaveChangesAsync(ct);
        return ToDto(c);
    }

    // ---------- internals ----------

    private static void ValidateConfig(WriteCouponRequest req)
    {
        if (req.DiscountPercent <= 0 && (req.DiscountAmount ?? 0) <= 0)
            throw new CouponException(CouponError.InvalidConfig,
                "Coupon must define a positive DiscountPercent or DiscountAmount.");
        if (req.DiscountPercent > 0 && (req.DiscountAmount ?? 0) > 0)
            throw new CouponException(CouponError.InvalidConfig,
                "Use either DiscountPercent or DiscountAmount, not both.");
        if (req.ValidFrom is { } from && req.ValidUntil is { } until && until < from)
            throw new CouponException(CouponError.InvalidConfig, "ValidUntil cannot be before ValidFrom.");
    }

    private static (bool Ok, string? Reason) CheckGate(Coupon c)
    {
        if (!c.Active) return (false, "INACTIVE");
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (c.ValidFrom is { } from && today < from) return (false, "OUTSIDE_WINDOW");
        if (c.ValidUntil is { } until && today > until) return (false, "OUTSIDE_WINDOW");
        if (c.MaxRedemptions is { } cap && c.Redeemed >= cap) return (false, "REDEMPTIONS_EXHAUSTED");
        return (true, null);
    }

    private static decimal ComputeDiscount(Coupon c, decimal subtotal)
    {
        decimal d = 0m;
        if (c.DiscountPercent > 0) d = Math.Round(subtotal * c.DiscountPercent, 2);
        else if (c.DiscountAmount is { } fixedAmt) d = fixedAmt;
        return Math.Min(Math.Max(0m, d), subtotal);
    }

    private static CouponDto ToDto(Coupon c) => new(
        c.Id, c.Code, c.Description, c.DiscountPercent, c.DiscountAmount,
        c.ValidFrom, c.ValidUntil, c.MaxRedemptions, c.Redeemed, c.Active, c.CreatedAt);
}

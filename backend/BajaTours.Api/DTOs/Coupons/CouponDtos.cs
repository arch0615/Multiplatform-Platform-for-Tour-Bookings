using System.ComponentModel.DataAnnotations;

namespace BajaTours.Api.DTOs.Coupons;

public record CouponDto(
    Guid Id,
    string Code,
    string? Description,
    decimal DiscountPercent,
    decimal? DiscountAmount,
    DateOnly? ValidFrom,
    DateOnly? ValidUntil,
    int? MaxRedemptions,
    int Redeemed,
    bool Active,
    DateTime CreatedAt);

public class WriteCouponRequest
{
    [Required, MaxLength(32)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Description { get; set; }

    [Range(0, 1, ErrorMessage = "DiscountPercent must be between 0 and 1 (e.g. 0.10 = 10%).")]
    public decimal DiscountPercent { get; set; }

    [Range(0, 100000)]
    public decimal? DiscountAmount { get; set; }

    public DateOnly? ValidFrom { get; set; }
    public DateOnly? ValidUntil { get; set; }

    [Range(1, 100000)]
    public int? MaxRedemptions { get; set; }

    public bool Active { get; set; } = true;
}

public class ValidateCouponRequest
{
    [Required, MaxLength(32)]
    public string Code { get; set; } = string.Empty;

    [Range(0, 1000000)]
    public decimal Subtotal { get; set; }
}

public record ValidateCouponResponse(
    bool Valid,
    string? Reason,
    string Code,
    string? Description,
    decimal DiscountPercent,
    decimal? DiscountAmount,
    decimal AppliedDiscount,
    decimal NewTotal);

using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.Domain.Entities;

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Reference { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public Guid TourId { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly? StartTime { get; set; }
    public int Adults { get; set; }
    public int Children { get; set; }
    public decimal Subtotal { get; set; }
    public decimal CommissionAmount { get; set; }
    public decimal TotalPrice { get; set; }
    public string Currency { get; set; } = "MXN";
    // BCP-47 short tag ("es", "en") captured at checkout from Accept-Language.
    // Drives recipient-facing email localization. Existing rows default to "es".
    public string Language { get; set; } = "es";
    public string? CouponCode { get; set; }
    public decimal DiscountAmount { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public string? Notes { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public DateTime? CancelledAt { get; set; }
    public string? CancelReason { get; set; }
    public string? CancelComment { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Tour Tour { get; set; } = null!;
    public Payment? Payment { get; set; }
    public Review? Review { get; set; }
}

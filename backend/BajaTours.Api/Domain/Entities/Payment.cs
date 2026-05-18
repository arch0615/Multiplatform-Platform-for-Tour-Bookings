using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.Domain.Entities;

public class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public PaymentProvider Provider { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? ProviderPaymentId { get; set; }
    public string? ProviderPreferenceId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "MXN";
    public string? RawPayload { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Booking Booking { get; set; } = null!;
}

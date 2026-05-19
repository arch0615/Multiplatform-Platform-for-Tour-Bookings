using System.ComponentModel.DataAnnotations;

namespace BajaTours.Api.DTOs.Bookings;

public class CreateBookingRequest
{
    [Required]
    public Guid TourId { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    public TimeOnly? StartTime { get; set; }

    [Range(0, 50)]
    public int Adults { get; set; }

    [Range(0, 50)]
    public int Children { get; set; }

    [Required, MaxLength(200)]
    public string ContactName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(256)]
    public string ContactEmail { get; set; } = string.Empty;

    [MaxLength(32)]
    public string? ContactPhone { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    [MaxLength(32)]
    public string? CouponCode { get; set; }
}

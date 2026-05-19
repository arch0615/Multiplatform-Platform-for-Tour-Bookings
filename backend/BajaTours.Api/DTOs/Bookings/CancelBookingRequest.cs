using System.ComponentModel.DataAnnotations;

namespace BajaTours.Api.DTOs.Bookings;

public class CancelBookingRequest
{
    [Required, MaxLength(64)]
    public string Reason { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Comment { get; set; }
}

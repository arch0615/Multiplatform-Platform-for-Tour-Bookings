using System.ComponentModel.DataAnnotations;
using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Provider;

public class WriteTourRequest
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public TourCategory Category { get; set; }

    [Required, MaxLength(120)]
    public string Location { get; set; } = string.Empty;

    [Required, MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Itinerary { get; set; }

    [MaxLength(200)]
    public string? MeetingPoint { get; set; }

    [Required, MaxLength(64)]
    public string Duration { get; set; } = string.Empty;

    [Required, MaxLength(32)]
    public string Languages { get; set; } = "es";

    [Required, Range(0.01, 999999)]
    public decimal PriceAdult { get; set; }

    [Range(0.0, 999999)]
    public decimal? PriceChild { get; set; }

    [Required, Range(1, 999)]
    public int MaxGuests { get; set; }

    [Required]
    public TourStatus Status { get; set; } = TourStatus.Active;

    public List<string> ImageUrls { get; set; } = new();
}

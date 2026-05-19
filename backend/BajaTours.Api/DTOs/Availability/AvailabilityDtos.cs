using System.ComponentModel.DataAnnotations;

namespace BajaTours.Api.DTOs.Availability;

public class WriteAvailabilityItem
{
    [Required]
    public DateOnly Date { get; set; }

    public TimeOnly? StartTime { get; set; }

    [Range(0, 1000, ErrorMessage = "Capacity must be 0–1000.")]
    public int Capacity { get; set; }

    [Range(0, 1000000)]
    public decimal? PriceOverride { get; set; }
}

public class WriteAvailabilityRequest
{
    [Required]
    public List<WriteAvailabilityItem> Items { get; set; } = new();
}

/// <summary>Full record returned to providers; includes Booked count.</summary>
public record AvailabilityWindowDto(
    Guid Id,
    DateOnly Date,
    TimeOnly? StartTime,
    int Capacity,
    int Booked,
    int Remaining,
    decimal? PriceOverride);

/// <summary>Slim shape for the public booking calendar — never leaks the exact
/// Booked count, only "remaining" so competitors can't scrape sell-through rates.</summary>
public record PublicAvailabilitySlotDto(
    DateOnly Date,
    TimeOnly? StartTime,
    int Remaining,
    decimal? PriceOverride);

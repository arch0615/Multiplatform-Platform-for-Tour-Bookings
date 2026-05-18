using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.Domain.Entities;

public class Tour
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProviderId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public TourCategory Category { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Itinerary { get; set; }
    public string? MeetingPoint { get; set; }
    public string Duration { get; set; } = string.Empty;
    public string Languages { get; set; } = "es";
    public decimal PriceAdult { get; set; }
    public decimal? PriceChild { get; set; }
    public int MaxGuests { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public TourStatus Status { get; set; } = TourStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Provider Provider { get; set; } = null!;
    public ICollection<TourImage> Images { get; set; } = new List<TourImage>();
    public ICollection<TourAvailability> Availability { get; set; } = new List<TourAvailability>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}

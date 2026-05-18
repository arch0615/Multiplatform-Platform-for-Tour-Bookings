using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.Domain.Entities;

public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? BookingId { get; set; }
    public Guid? UserId { get; set; }
    public Guid TourId { get; set; }
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string? ExternalAuthor { get; set; }
    public ReviewSource Source { get; set; } = ReviewSource.Internal;
    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Booking? Booking { get; set; }
    public User? User { get; set; }
    public Tour Tour { get; set; } = null!;
}

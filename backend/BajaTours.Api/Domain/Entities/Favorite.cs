namespace BajaTours.Api.Domain.Entities;

public class Favorite
{
    public Guid UserId { get; set; }
    public Guid TourId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Tour Tour { get; set; } = null!;
}

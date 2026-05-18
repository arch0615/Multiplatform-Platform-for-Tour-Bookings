namespace BajaTours.Api.Domain.Entities;

public class TourAvailability
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TourId { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly? StartTime { get; set; }
    public int Capacity { get; set; }
    public int Booked { get; set; }
    public decimal? PriceOverride { get; set; }

    public Tour Tour { get; set; } = null!;
}

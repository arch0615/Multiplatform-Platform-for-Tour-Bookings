namespace BajaTours.Api.Domain.Entities;

public class TourImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TourId { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public int SortOrder { get; set; }

    public Tour Tour { get; set; } = null!;
}

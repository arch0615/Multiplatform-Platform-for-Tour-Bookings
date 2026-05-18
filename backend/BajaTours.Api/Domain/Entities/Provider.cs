using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.Domain.Entities;

public class Provider
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string? Rfc { get; set; }
    public string? Location { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public string? ContactPhone { get; set; }
    public decimal CommissionRate { get; set; } = 0.15m;
    public bool Verified { get; set; }
    public ProviderStatus Status { get; set; } = ProviderStatus.PendingVerification;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<Tour> Tours { get; set; } = new List<Tour>();
}

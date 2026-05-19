using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.Domain.Entities;

public class AuthToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public AuthTokenPurpose Purpose { get; set; }
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime? ConsumedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;

    public bool IsUsable => ConsumedAt is null && DateTime.UtcNow < ExpiresAt;
}

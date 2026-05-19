namespace BajaTours.Api.Domain.Entities;

/// <summary>One row per write-mutating call against /api/admin/*.
/// Lets us answer "who touched this and when".</summary>
public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? ActorUserId { get; set; }
    public string? ActorEmail { get; set; }
    public string Method { get; set; } = string.Empty;     // POST | PUT | DELETE
    public string Path { get; set; } = string.Empty;       // /api/admin/providers/xxx/verify
    public string? RouteValues { get; set; }               // {"id":"..."}
    public string? RequestBody { get; set; }               // trimmed, max ~2 KB
    public int StatusCode { get; set; }
    public string? Ip { get; set; }
    public DateTime At { get; set; } = DateTime.UtcNow;
}

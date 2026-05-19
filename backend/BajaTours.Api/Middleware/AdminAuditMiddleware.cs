using System.Security.Claims;
using System.Text.Json;
using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;

namespace BajaTours.Api.Middleware;

/// <summary>
/// Records one AuditLog row per write-mutating call against /api/admin/*.
/// Runs after the request is handled so we capture the final StatusCode; we
/// buffer the request body before the controller reads it so it's still
/// available to log. Body is truncated at 2 KB.
/// </summary>
public class AdminAuditMiddleware
{
    private const int MaxBodyBytes = 2048;
    private static readonly HashSet<string> WriteMethods = new(StringComparer.OrdinalIgnoreCase)
    {
        "POST", "PUT", "PATCH", "DELETE",
    };

    private readonly RequestDelegate _next;
    private readonly ILogger<AdminAuditMiddleware> _logger;

    public AdminAuditMiddleware(RequestDelegate next, ILogger<AdminAuditMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        var path = context.Request.Path.Value ?? "";
        var method = context.Request.Method;
        var shouldAudit = path.StartsWith("/api/admin/", StringComparison.OrdinalIgnoreCase)
                         && WriteMethods.Contains(method);

        if (!shouldAudit)
        {
            await _next(context);
            return;
        }

        // Buffer the body so we can both log it and let the controller read it.
        context.Request.EnableBuffering();
        var bodySnippet = await ReadBodySnippetAsync(context.Request, context.RequestAborted);
        context.Request.Body.Position = 0;

        await _next(context);

        try
        {
            var actorIdRaw = context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? actorId = Guid.TryParse(actorIdRaw, out var g) ? g : null;
            var actorEmail = context.User?.FindFirstValue(ClaimTypes.Email);
            var routeValuesJson = context.GetRouteData().Values.Count > 0
                ? JsonSerializer.Serialize(context.GetRouteData().Values.ToDictionary(k => k.Key, v => v.Value?.ToString()))
                : null;

            db.AuditLogs.Add(new AuditLog
            {
                ActorUserId = actorId,
                ActorEmail = actorEmail,
                Method = method,
                Path = path.Length > 512 ? path.Substring(0, 512) : path,
                RouteValues = routeValuesJson,
                RequestBody = bodySnippet,
                StatusCode = context.Response.StatusCode,
                Ip = context.Connection.RemoteIpAddress?.ToString(),
            });
            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Audit failures must never break the request. Log and move on.
            _logger.LogError(ex, "Failed to write audit log for {Method} {Path}", method, path);
        }
    }

    private static async Task<string?> ReadBodySnippetAsync(HttpRequest req, CancellationToken ct)
    {
        if (req.ContentLength is null or 0) return null;
        var buffer = new byte[Math.Min(MaxBodyBytes, (int)(req.ContentLength ?? 0))];
        var read = await req.Body.ReadAsync(buffer.AsMemory(0, buffer.Length), ct);
        if (read <= 0) return null;
        var s = System.Text.Encoding.UTF8.GetString(buffer, 0, read);
        // Best-effort redaction of sensitive keys
        s = System.Text.RegularExpressions.Regex.Replace(s, "\"(password|newPassword|token|refreshToken)\"\\s*:\\s*\"[^\"]*\"", "\"$1\":\"[REDACTED]\"", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        return s.Length > MaxBodyBytes ? s.Substring(0, MaxBodyBytes) : s;
    }
}

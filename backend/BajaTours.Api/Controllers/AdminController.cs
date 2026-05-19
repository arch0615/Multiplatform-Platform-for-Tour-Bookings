using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Admin;
using BajaTours.Api.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BajaTours.Api.Controllers;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _svc;
    public AdminController(IAdminService svc) => _svc = svc;

    [HttpGet("dashboard-stats")]
    public async Task<ActionResult<AdminDashboardStatsDto>> Stats(CancellationToken ct)
        => Ok(await _svc.GetDashboardStatsAsync(ct));

    [HttpGet("providers")]
    public async Task<ActionResult<IReadOnlyList<AdminProviderDto>>> ListProviders(
        [FromQuery] ProviderStatus? status,
        [FromQuery] string? q,
        CancellationToken ct)
        => Ok(await _svc.ListProvidersAsync(status, q, ct));

    [HttpPost("providers/{id:guid}/verify")]
    public async Task<ActionResult<AdminProviderDto>> Verify(Guid id, CancellationToken ct)
    {
        try { return Ok(await _svc.VerifyProviderAsync(id, ct)); }
        catch (AdminException ex) when (ex.Error == AdminError.ProviderNotFound) { return NotFound(new { error = ex.Message }); }
    }

    [HttpPost("providers/{id:guid}/suspend")]
    public async Task<ActionResult<AdminProviderDto>> Suspend(Guid id, [FromBody] SuspendProviderRequest? req, CancellationToken ct)
    {
        try { return Ok(await _svc.SuspendProviderAsync(id, req?.Reason, ct)); }
        catch (AdminException ex) when (ex.Error == AdminError.ProviderNotFound) { return NotFound(new { error = ex.Message }); }
    }

    [HttpGet("bookings")]
    public async Task<ActionResult<IReadOnlyList<AdminBookingDto>>> ListBookings(
        [FromQuery] BookingStatus? status,
        [FromQuery] Guid? providerId,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        CancellationToken ct)
        => Ok(await _svc.ListBookingsAsync(status, providerId, from, to, ct));
}

using System.Security.Claims;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Provider;
using BajaTours.Api.Services.ProviderTours;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BajaTours.Api.Controllers;

[ApiController]
[Authorize(Policy = "ProviderOnly")]
[Route("api/provider")]
public class ProviderReportsController : ControllerBase
{
    private readonly IProviderReportsService _svc;
    public ProviderReportsController(IProviderReportsService svc) => _svc = svc;

    [HttpGet("bookings")]
    public async Task<ActionResult<IReadOnlyList<ProviderBookingDto>>> ListBookings(
        [FromQuery] BookingStatus? status,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try
        {
            var items = await _svc.ListBookingsAsync(userId, status, from, to, ct);
            return Ok(items);
        }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotProvider)
        {
            return Forbid();
        }
    }

    [HttpGet("earnings")]
    public async Task<ActionResult<ProviderEarningsDto>> GetEarnings(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try
        {
            return Ok(await _svc.GetEarningsAsync(userId, ct));
        }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotProvider)
        {
            return Forbid();
        }
    }

    private bool TryGetUserId(out Guid userId)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(sub, out userId);
    }
}

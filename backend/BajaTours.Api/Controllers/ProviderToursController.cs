using System.Security.Claims;
using BajaTours.Api.DTOs.Availability;
using BajaTours.Api.DTOs.Provider;
using BajaTours.Api.Services.Availability;
using BajaTours.Api.Services.ProviderTours;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BajaTours.Api.Controllers;

[ApiController]
[Authorize(Policy = "ProviderOnly")]
[Route("api/provider/tours")]
public class ProviderToursController : ControllerBase
{
    private readonly IProviderToursService _svc;
    private readonly IAvailabilityService _availability;

    public ProviderToursController(IProviderToursService svc, IAvailabilityService availability)
    {
        _svc = svc;
        _availability = availability;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProviderTourDto>>> ListMine(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try
        {
            var items = await _svc.ListMineAsync(userId, ct);
            return Ok(items);
        }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotProvider)
        {
            return Forbid();
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProviderTourDto>> GetMine(Guid id, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try
        {
            return Ok(await _svc.GetMineAsync(userId, id, ct));
        }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.TourNotFound) { return NotFound(new { error = ex.Message }); }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotOwner) { return Forbid(); }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotProvider) { return Forbid(); }
    }

    [HttpPost]
    public async Task<ActionResult<ProviderTourDto>> Create([FromBody] WriteTourRequest req, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try
        {
            var dto = await _svc.CreateAsync(userId, req, ct);
            return CreatedAtAction(nameof(GetMine), new { id = dto.Id }, dto);
        }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotProvider)
        {
            return Forbid();
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProviderTourDto>> Update(Guid id, [FromBody] WriteTourRequest req, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try
        {
            return Ok(await _svc.UpdateAsync(userId, id, req, ct));
        }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.TourNotFound) { return NotFound(new { error = ex.Message }); }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotOwner) { return Forbid(); }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotProvider) { return Forbid(); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ProviderTourDto>> Archive(Guid id, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try
        {
            return Ok(await _svc.ArchiveAsync(userId, id, ct));
        }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.TourNotFound) { return NotFound(new { error = ex.Message }); }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotOwner) { return Forbid(); }
        catch (ProviderTourException ex) when (ex.Error == ProviderTourError.NotProvider) { return Forbid(); }
    }

    [HttpGet("{id:guid}/availability")]
    public async Task<ActionResult<IReadOnlyList<AvailabilityWindowDto>>> GetAvailability(
        Guid id, [FromQuery] DateOnly? from, [FromQuery] DateOnly? to, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try { return Ok(await _availability.GetForProviderAsync(userId, id, from, to, ct)); }
        catch (AvailabilityException ex) when (ex.Error == AvailabilityError.TourNotFound) { return NotFound(new { error = ex.Message }); }
        catch (AvailabilityException ex) when (ex.Error == AvailabilityError.NotOwner) { return Forbid(); }
        catch (AvailabilityException ex) when (ex.Error == AvailabilityError.NotProvider) { return Forbid(); }
    }

    [HttpPut("{id:guid}/availability")]
    public async Task<ActionResult<IReadOnlyList<AvailabilityWindowDto>>> WriteAvailability(
        Guid id, [FromBody] WriteAvailabilityRequest req, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try { return Ok(await _availability.BulkUpsertAsync(userId, id, req.Items, ct)); }
        catch (AvailabilityException ex) when (ex.Error == AvailabilityError.TourNotFound) { return NotFound(new { error = ex.Message }); }
        catch (AvailabilityException ex) when (ex.Error == AvailabilityError.NotOwner) { return Forbid(); }
        catch (AvailabilityException ex) when (ex.Error == AvailabilityError.NotProvider) { return Forbid(); }
    }

    private bool TryGetUserId(out Guid userId)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(sub, out userId);
    }
}

using System.Security.Claims;
using BajaTours.Api.DTOs.Favorites;
using BajaTours.Api.Services.Favorites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BajaTours.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/favorites")]
public class FavoritesController : ControllerBase
{
    private readonly IFavoritesService _svc;
    public FavoritesController(IFavoritesService svc) => _svc = svc;

    [HttpGet("me")]
    public async Task<ActionResult<IReadOnlyList<FavoriteDto>>> ListMine(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        return Ok(await _svc.ListForUserAsync(userId, ct));
    }

    /// <summary>Returns just the tour IDs the caller has favorited. Used by the SPA to
    /// hydrate heart-icon state across the catalog without fetching full tour DTOs.</summary>
    [HttpGet("me/ids")]
    public async Task<ActionResult<IReadOnlyList<Guid>>> ListMineIds(CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        return Ok(await _svc.ListIdsForUserAsync(userId, ct));
    }

    [HttpPost("{tourId:guid}")]
    public async Task<IActionResult> Add(Guid tourId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        try
        {
            await _svc.AddAsync(userId, tourId, ct);
            return NoContent();
        }
        catch (FavoriteException ex) when (ex.Error == FavoriteError.TourNotFound)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpDelete("{tourId:guid}")]
    public async Task<IActionResult> Remove(Guid tourId, CancellationToken ct)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        await _svc.RemoveAsync(userId, tourId, ct);
        return NoContent();
    }

    private bool TryGetUserId(out Guid userId)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.TryParse(sub, out userId);
    }
}

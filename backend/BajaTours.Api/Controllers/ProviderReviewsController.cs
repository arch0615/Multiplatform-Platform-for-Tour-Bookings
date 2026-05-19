using System.Security.Claims;
using BajaTours.Api.DTOs.Reviews;
using BajaTours.Api.Services.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BajaTours.Api.Controllers;

[ApiController]
[Authorize(Policy = "ProviderOnly")]
[Route("api/provider/reviews")]
public class ProviderReviewsController : ControllerBase
{
    private readonly IReviewsService _reviews;
    public ProviderReviewsController(IReviewsService reviews) => _reviews = reviews;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProviderReviewDto>>> ListMine(CancellationToken ct)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (!Guid.TryParse(sub, out var userId)) return Unauthorized();

        try
        {
            return Ok(await _reviews.ListForProviderAsync(userId, ct));
        }
        catch (ReviewException ex) when (ex.Error == ReviewError.NotProvider)
        {
            return Forbid();
        }
    }
}

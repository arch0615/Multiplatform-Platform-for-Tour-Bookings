using BajaTours.Api.Data;
using BajaTours.Api.DTOs.Tours;
using BajaTours.Api.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Controllers;

[ApiController]
[Route("api/tours")]
public class ToursController : ControllerBase
{
    private readonly AppDbContext _db;

    public ToursController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TourListItemDto>>> List(
        [FromQuery] TourCategory? category,
        [FromQuery] string? location,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? language,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var query = _db.Tours
            .AsNoTracking()
            .Where(t => t.Status == TourStatus.Active);

        if (category is { } c) query = query.Where(t => t.Category == c);
        if (!string.IsNullOrWhiteSpace(location)) query = query.Where(t => t.Location == location);
        if (minPrice is { } min) query = query.Where(t => t.PriceAdult >= min);
        if (maxPrice is { } max) query = query.Where(t => t.PriceAdult <= max);
        if (!string.IsNullOrWhiteSpace(language)) query = query.Where(t => t.Languages.Contains(language));

        pageSize = Math.Clamp(pageSize, 1, 100);
        page = Math.Max(page, 1);

        var items = await query
            .OrderByDescending(t => t.Rating)
            .ThenByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TourListItemDto(
                t.Id,
                t.Slug,
                t.Title,
                t.Category,
                t.Location,
                t.Duration,
                t.PriceAdult,
                t.PriceChild,
                t.MaxGuests,
                t.Rating,
                t.ReviewCount,
                t.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault(),
                t.Provider.CompanyName))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<object>> GetBySlug(string slug, CancellationToken ct)
    {
        var tour = await _db.Tours
            .AsNoTracking()
            .Include(t => t.Provider)
            .Include(t => t.Images)
            .FirstOrDefaultAsync(t => t.Slug == slug, ct);

        if (tour is null) return NotFound();

        return Ok(new
        {
            tour.Id,
            tour.Slug,
            tour.Title,
            tour.Category,
            tour.Location,
            tour.Description,
            tour.Itinerary,
            tour.MeetingPoint,
            tour.Duration,
            tour.Languages,
            tour.PriceAdult,
            tour.PriceChild,
            tour.MaxGuests,
            tour.Rating,
            tour.ReviewCount,
            Images = tour.Images.OrderBy(i => i.SortOrder).Select(i => new { i.Url, i.Caption }),
            Provider = new { tour.Provider.Id, tour.Provider.CompanyName, tour.Provider.Verified }
        });
    }
}

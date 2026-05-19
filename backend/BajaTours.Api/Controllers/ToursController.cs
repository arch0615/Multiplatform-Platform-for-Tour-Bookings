using BajaTours.Api.Data;
using BajaTours.Api.DTOs.Availability;
using BajaTours.Api.DTOs.Tours;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.Services.Availability;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Controllers;

[ApiController]
[Route("api/tours")]
public class ToursController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IAvailabilityService _availability;

    public ToursController(AppDbContext db, IAvailabilityService availability)
    {
        _db = db;
        _availability = availability;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TourListItemDto>>> List(
        [FromQuery] TourCategory? category,
        [FromQuery] string? location,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? language,
        [FromQuery] string? q,
        [FromQuery] decimal? minRating,
        [FromQuery] string? sort,
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
        if (minRating is { } r) query = query.Where(t => t.Rating >= r);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var needle = q.Trim();
            query = query.Where(t =>
                EF.Functions.Like(t.Title, $"%{needle}%") ||
                EF.Functions.Like(t.Description, $"%{needle}%") ||
                EF.Functions.Like(t.Location, $"%{needle}%"));
        }

        query = sort switch
        {
            "priceLow" => query.OrderBy(t => t.PriceAdult),
            "priceHigh" => query.OrderByDescending(t => t.PriceAdult),
            "rating" => query.OrderByDescending(t => t.Rating).ThenByDescending(t => t.ReviewCount),
            "newest" => query.OrderByDescending(t => t.CreatedAt),
            _ => query.OrderByDescending(t => t.Rating).ThenByDescending(t => t.CreatedAt)
        };

        pageSize = Math.Clamp(pageSize, 1, 100);
        page = Math.Max(page, 1);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TourListItemDto(
                t.Id,
                t.Slug,
                t.Title,
                t.Category,
                t.Location,
                t.Duration,
                t.Languages,
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

    [HttpGet("{slug}/availability")]
    public async Task<ActionResult<IReadOnlyList<PublicAvailabilitySlotDto>>> Availability(
        string slug, [FromQuery] string? month, CancellationToken ct)
    {
        try { return Ok(await _availability.GetPublicForSlugAsync(slug, month, ct)); }
        catch (AvailabilityException ex) when (ex.Error == AvailabilityError.TourNotFound)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpGet("{slug}/reviews")]
    public async Task<ActionResult<IEnumerable<TourReviewDto>>> Reviews(string slug, CancellationToken ct)
    {
        var tourId = await _db.Tours
            .Where(t => t.Slug == slug)
            .Select(t => (Guid?)t.Id)
            .FirstOrDefaultAsync(ct);
        if (tourId is null) return NotFound();

        var reviews = await _db.Reviews
            .Where(r => r.TourId == tourId && r.Status == ReviewStatus.Approved)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new TourReviewDto(
                r.Id,
                r.ExternalAuthor ?? (r.User != null ? r.User.FullName : "Anonymous"),
                r.Rating,
                r.Title,
                r.Comment,
                r.Source,
                r.Source == ReviewSource.Internal && r.BookingId != null,
                r.CreatedAt))
            .ToListAsync(ct);

        return Ok(reviews);
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

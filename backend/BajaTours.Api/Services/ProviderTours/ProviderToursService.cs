using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Provider;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Services.ProviderTours;

public enum ProviderTourError { None, NotProvider, TourNotFound, NotOwner }

public class ProviderTourException : Exception
{
    public ProviderTourError Error { get; }
    public ProviderTourException(ProviderTourError error, string message) : base(message) => Error = error;
}

public interface IProviderToursService
{
    Task<IReadOnlyList<ProviderTourDto>> ListMineAsync(Guid userId, CancellationToken ct);
    Task<ProviderTourDto> GetMineAsync(Guid userId, Guid tourId, CancellationToken ct);
    Task<ProviderTourDto> CreateAsync(Guid userId, WriteTourRequest req, CancellationToken ct);
    Task<ProviderTourDto> UpdateAsync(Guid userId, Guid tourId, WriteTourRequest req, CancellationToken ct);
    Task<ProviderTourDto> ArchiveAsync(Guid userId, Guid tourId, CancellationToken ct);
}

public class ProviderToursService : IProviderToursService
{
    private readonly AppDbContext _db;
    public ProviderToursService(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<ProviderTourDto>> ListMineAsync(Guid userId, CancellationToken ct)
    {
        var providerId = await GetProviderIdAsync(userId, ct);

        var tourIds = await _db.Tours
            .Where(t => t.ProviderId == providerId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => t.Id)
            .ToListAsync(ct);

        var list = new List<ProviderTourDto>(tourIds.Count);
        foreach (var id in tourIds)
        {
            var dto = await BuildDtoAsync(id, ct);
            if (dto is not null) list.Add(dto);
        }
        return list;
    }

    public async Task<ProviderTourDto> GetMineAsync(Guid userId, Guid tourId, CancellationToken ct)
    {
        var providerId = await GetProviderIdAsync(userId, ct);
        await EnsureOwnedAsync(tourId, providerId, ct);
        return (await BuildDtoAsync(tourId, ct))!;
    }

    public async Task<ProviderTourDto> CreateAsync(Guid userId, WriteTourRequest req, CancellationToken ct)
    {
        var providerId = await GetProviderIdAsync(userId, ct);
        var slug = await GenerateUniqueSlugAsync(req.Title, null, ct);

        var tour = new Tour
        {
            ProviderId = providerId,
            Slug = slug,
            Title = req.Title.Trim(),
            Category = req.Category,
            Location = req.Location.Trim(),
            Description = req.Description.Trim(),
            Itinerary = string.IsNullOrWhiteSpace(req.Itinerary) ? null : req.Itinerary.Trim(),
            MeetingPoint = string.IsNullOrWhiteSpace(req.MeetingPoint) ? null : req.MeetingPoint.Trim(),
            Duration = req.Duration.Trim(),
            Languages = NormalizeLanguages(req.Languages),
            PriceAdult = req.PriceAdult,
            PriceChild = req.PriceChild,
            MaxGuests = req.MaxGuests,
            Status = req.Status,
        };
        _db.Tours.Add(tour);
        await _db.SaveChangesAsync(ct);

        var ordered = NormalizeImageUrls(req.ImageUrls);
        for (var i = 0; i < ordered.Count; i++)
        {
            _db.TourImages.Add(new TourImage
            {
                TourId = tour.Id,
                Url = ordered[i],
                SortOrder = i,
            });
        }
        await _db.SaveChangesAsync(ct);

        return (await BuildDtoAsync(tour.Id, ct))!;
    }

    public async Task<ProviderTourDto> UpdateAsync(Guid userId, Guid tourId, WriteTourRequest req, CancellationToken ct)
    {
        var providerId = await GetProviderIdAsync(userId, ct);
        var tour = await _db.Tours
            .Include(t => t.Images)
            .FirstOrDefaultAsync(t => t.Id == tourId, ct)
            ?? throw new ProviderTourException(ProviderTourError.TourNotFound, "Tour not found.");

        if (tour.ProviderId != providerId)
            throw new ProviderTourException(ProviderTourError.NotOwner, "You do not own this tour.");

        if (!string.Equals(tour.Title, req.Title.Trim(), StringComparison.Ordinal))
        {
            tour.Slug = await GenerateUniqueSlugAsync(req.Title, tour.Id, ct);
        }
        tour.Title = req.Title.Trim();
        tour.Category = req.Category;
        tour.Location = req.Location.Trim();
        tour.Description = req.Description.Trim();
        tour.Itinerary = string.IsNullOrWhiteSpace(req.Itinerary) ? null : req.Itinerary.Trim();
        tour.MeetingPoint = string.IsNullOrWhiteSpace(req.MeetingPoint) ? null : req.MeetingPoint.Trim();
        tour.Duration = req.Duration.Trim();
        tour.Languages = NormalizeLanguages(req.Languages);
        tour.PriceAdult = req.PriceAdult;
        tour.PriceChild = req.PriceChild;
        tour.MaxGuests = req.MaxGuests;
        tour.Status = req.Status;
        tour.UpdatedAt = DateTime.UtcNow;

        _db.TourImages.RemoveRange(tour.Images);
        var ordered = NormalizeImageUrls(req.ImageUrls);
        for (var i = 0; i < ordered.Count; i++)
        {
            _db.TourImages.Add(new TourImage
            {
                TourId = tour.Id,
                Url = ordered[i],
                SortOrder = i,
            });
        }

        await _db.SaveChangesAsync(ct);
        return (await BuildDtoAsync(tour.Id, ct))!;
    }

    public async Task<ProviderTourDto> ArchiveAsync(Guid userId, Guid tourId, CancellationToken ct)
    {
        var providerId = await GetProviderIdAsync(userId, ct);
        var tour = await _db.Tours.FirstOrDefaultAsync(t => t.Id == tourId, ct)
            ?? throw new ProviderTourException(ProviderTourError.TourNotFound, "Tour not found.");
        if (tour.ProviderId != providerId)
            throw new ProviderTourException(ProviderTourError.NotOwner, "You do not own this tour.");

        tour.Status = TourStatus.Archived;
        tour.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return (await BuildDtoAsync(tour.Id, ct))!;
    }

    private async Task<Guid> GetProviderIdAsync(Guid userId, CancellationToken ct)
    {
        var providerId = await _db.Providers
            .Where(p => p.UserId == userId)
            .Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync(ct);
        return providerId
            ?? throw new ProviderTourException(ProviderTourError.NotProvider, "Current user is not a provider.");
    }

    private async Task EnsureOwnedAsync(Guid tourId, Guid providerId, CancellationToken ct)
    {
        var owner = await _db.Tours.Where(t => t.Id == tourId)
            .Select(t => (Guid?)t.ProviderId).FirstOrDefaultAsync(ct);
        if (owner is null)
            throw new ProviderTourException(ProviderTourError.TourNotFound, "Tour not found.");
        if (owner != providerId)
            throw new ProviderTourException(ProviderTourError.NotOwner, "You do not own this tour.");
    }

    private async Task<ProviderTourDto?> BuildDtoAsync(Guid tourId, CancellationToken ct)
    {
        var t = await _db.Tours.AsNoTracking()
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == tourId, ct);
        if (t is null) return null;

        var bookingCount = await _db.Bookings.CountAsync(b => b.TourId == tourId, ct);
        var images = t.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).ToList();

        return new ProviderTourDto(
            t.Id, t.Slug, t.Title, t.Category, t.Location, t.Description, t.Itinerary,
            t.MeetingPoint, t.Duration, t.Languages, t.PriceAdult, t.PriceChild, t.MaxGuests,
            t.Rating, t.ReviewCount, t.Status, t.CreatedAt, t.UpdatedAt, images, bookingCount);
    }

    private async Task<string> GenerateUniqueSlugAsync(string title, Guid? excludeId, CancellationToken ct)
    {
        var baseSlug = Slugify(title);
        if (string.IsNullOrEmpty(baseSlug)) baseSlug = "tour";

        var slug = baseSlug;
        var n = 2;
        while (await _db.Tours.AnyAsync(t => t.Slug == slug && (!excludeId.HasValue || t.Id != excludeId.Value), ct))
        {
            slug = $"{baseSlug}-{n++}";
        }
        return slug;
    }

    private static string Slugify(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        var normalized = input.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var c in normalized)
        {
            var cat = CharUnicodeInfo.GetUnicodeCategory(c);
            if (cat != UnicodeCategory.NonSpacingMark) sb.Append(c);
        }
        var stripped = sb.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
        stripped = Regex.Replace(stripped, @"[^a-z0-9\s-]", "");
        stripped = Regex.Replace(stripped, @"[\s-]+", "-").Trim('-');
        return stripped.Length > 100 ? stripped[..100].TrimEnd('-') : stripped;
    }

    private static string NormalizeLanguages(string raw)
    {
        var parts = raw
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(p => p.ToLowerInvariant())
            .Distinct();
        return string.Join(",", parts);
    }

    private static List<string> NormalizeImageUrls(IEnumerable<string> urls)
        => urls
            .Select(u => u.Trim())
            .Where(u => !string.IsNullOrWhiteSpace(u))
            .Distinct()
            .Take(20)
            .ToList();
}

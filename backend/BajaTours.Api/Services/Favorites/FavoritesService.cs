using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.DTOs.Favorites;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Services.Favorites;

public enum FavoriteError
{
    None = 0,
    TourNotFound,
}

public class FavoriteException : Exception
{
    public FavoriteError Error { get; }
    public FavoriteException(FavoriteError error, string message) : base(message) => Error = error;
}

public interface IFavoritesService
{
    Task<IReadOnlyList<FavoriteDto>> ListForUserAsync(Guid userId, CancellationToken ct);
    Task<IReadOnlyList<Guid>> ListIdsForUserAsync(Guid userId, CancellationToken ct);
    Task AddAsync(Guid userId, Guid tourId, CancellationToken ct);
    Task RemoveAsync(Guid userId, Guid tourId, CancellationToken ct);
}

public class FavoritesService : IFavoritesService
{
    private readonly AppDbContext _db;
    public FavoritesService(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<FavoriteDto>> ListForUserAsync(Guid userId, CancellationToken ct)
    {
        return await _db.Favorites.AsNoTracking()
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new FavoriteDto(
                f.Tour.Id, f.Tour.Slug, f.Tour.Title, f.Tour.Category, f.Tour.Location,
                f.Tour.Duration, f.Tour.Languages, f.Tour.PriceAdult, f.Tour.PriceChild,
                f.Tour.Rating, f.Tour.ReviewCount,
                f.Tour.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault(),
                f.Tour.Provider.CompanyName,
                f.CreatedAt))
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Guid>> ListIdsForUserAsync(Guid userId, CancellationToken ct)
    {
        return await _db.Favorites.AsNoTracking()
            .Where(f => f.UserId == userId)
            .Select(f => f.TourId)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Guid userId, Guid tourId, CancellationToken ct)
    {
        // Idempotent — if it already exists, no-op
        var exists = await _db.Favorites.AnyAsync(f => f.UserId == userId && f.TourId == tourId, ct);
        if (exists) return;

        var tourOk = await _db.Tours.AnyAsync(t => t.Id == tourId, ct);
        if (!tourOk) throw new FavoriteException(FavoriteError.TourNotFound, "Tour not found.");

        _db.Favorites.Add(new Favorite { UserId = userId, TourId = tourId });
        await _db.SaveChangesAsync(ct);
    }

    public async Task RemoveAsync(Guid userId, Guid tourId, CancellationToken ct)
    {
        await _db.Favorites
            .Where(f => f.UserId == userId && f.TourId == tourId)
            .ExecuteDeleteAsync(ct);
    }
}

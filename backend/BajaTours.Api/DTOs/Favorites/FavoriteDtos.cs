using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Favorites;

public record FavoriteDto(
    Guid TourId,
    string Slug,
    string Title,
    TourCategory Category,
    string Location,
    string Duration,
    string Languages,
    decimal PriceAdult,
    decimal? PriceChild,
    decimal Rating,
    int ReviewCount,
    string? CoverImageUrl,
    string ProviderName,
    DateTime FavoritedAt);

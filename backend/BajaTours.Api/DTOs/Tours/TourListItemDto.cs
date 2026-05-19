using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Tours;

public record TourListItemDto(
    Guid Id,
    string Slug,
    string Title,
    TourCategory Category,
    string Location,
    string Duration,
    string Languages,
    decimal PriceAdult,
    decimal? PriceChild,
    int MaxGuests,
    decimal Rating,
    int ReviewCount,
    string? CoverImageUrl,
    string ProviderName);

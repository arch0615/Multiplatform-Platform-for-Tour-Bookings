using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Provider;

public record ProviderTourDto(
    Guid Id,
    string Slug,
    string Title,
    TourCategory Category,
    string Location,
    string Description,
    string? Itinerary,
    string? MeetingPoint,
    string Duration,
    string Languages,
    decimal PriceAdult,
    decimal? PriceChild,
    int MaxGuests,
    decimal Rating,
    int ReviewCount,
    TourStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    List<string> ImageUrls,
    int BookingCount);

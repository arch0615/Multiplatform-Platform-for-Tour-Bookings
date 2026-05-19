using BajaTours.Api.Domain.Entities;
using BajaTours.Api.Domain.Enums;

namespace BajaTours.Seed;

public record ProviderSeed(string Email, string OwnerName, string CompanyName, string Location, string Description);

public record ReviewSeed(string Author, int Rating, string? Title, string Comment, int DaysAgo);

public record TourSeed(
    Provider Provider, string Slug, string Title, TourCategory Category, string Location,
    string Description, string? Itinerary, string? MeetingPoint, string Duration, string Languages,
    decimal PriceAdult, decimal? PriceChild, int MaxGuests,
    string[] ImageUrls, string?[] ImageCaptions, ReviewSeed[] Reviews);

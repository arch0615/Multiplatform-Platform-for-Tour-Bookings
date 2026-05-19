using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Tours;

public record TourReviewDto(
    Guid Id,
    string AuthorName,
    int Rating,
    string? Title,
    string Comment,
    ReviewSource Source,
    bool Verified,
    DateTime CreatedAt);

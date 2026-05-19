using System.ComponentModel.DataAnnotations;
using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Reviews;

public class SubmitReviewRequest
{
    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(120)]
    public string? Title { get; set; }

    [Required, MaxLength(2000)]
    public string Comment { get; set; } = string.Empty;
}

public class ImportReviewRequest
{
    [Required, MaxLength(160)]
    public string TourSlug { get; set; } = string.Empty;

    [Required, MaxLength(120)]
    public string AuthorName { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(120)]
    public string? Title { get; set; }

    [Required, MaxLength(2000)]
    public string Comment { get; set; } = string.Empty;

    /// <summary>Source = Google or TripAdvisor. Admin can also use Internal but typically uses 1 or 2 for imports.</summary>
    public ReviewSource Source { get; set; } = ReviewSource.Google;

    /// <summary>If false (default), the imported review lands Approved (skip moderation queue).</summary>
    public bool RequiresApproval { get; set; }

    /// <summary>Optional original timestamp from the source platform.</summary>
    public DateTime? CreatedAt { get; set; }
}

public record AdminReviewDto(
    Guid Id,
    Guid? BookingId,
    Guid? UserId,
    Guid TourId,
    string TourSlug,
    string TourTitle,
    string ProviderName,
    string AuthorName,
    int Rating,
    string? Title,
    string Comment,
    ReviewSource Source,
    ReviewStatus Status,
    DateTime CreatedAt);

public record ProviderReviewDto(
    Guid Id,
    Guid TourId,
    string TourSlug,
    string TourTitle,
    string AuthorName,
    int Rating,
    string? Title,
    string Comment,
    ReviewSource Source,
    ReviewStatus Status,
    DateTime CreatedAt);

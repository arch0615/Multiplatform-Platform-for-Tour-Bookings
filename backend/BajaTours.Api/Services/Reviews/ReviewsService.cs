using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Reviews;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Services.Reviews;

public enum ReviewError
{
    None = 0,
    BookingNotFound,
    NotOwner,
    NotCompleted,
    AlreadyReviewed,
    ReviewNotFound,
    TourNotFound,
    NotProvider,
}

public class ReviewException : Exception
{
    public ReviewError Error { get; }
    public ReviewException(ReviewError error, string message) : base(message) => Error = error;
}

public interface IReviewsService
{
    Task<AdminReviewDto> SubmitForBookingAsync(Guid userId, Guid bookingId, SubmitReviewRequest req, CancellationToken ct);
    Task<IReadOnlyList<AdminReviewDto>> ListAdminAsync(ReviewStatus? status, CancellationToken ct);
    Task<AdminReviewDto> ApproveAsync(Guid reviewId, CancellationToken ct);
    Task<AdminReviewDto> RejectAsync(Guid reviewId, CancellationToken ct);
    Task<AdminReviewDto> ImportExternalAsync(ImportReviewRequest req, CancellationToken ct);
    Task<IReadOnlyList<ProviderReviewDto>> ListForProviderAsync(Guid userId, CancellationToken ct);
}

public class ReviewsService : IReviewsService
{
    private readonly AppDbContext _db;
    private readonly ILogger<ReviewsService> _logger;

    public ReviewsService(AppDbContext db, ILogger<ReviewsService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<AdminReviewDto> SubmitForBookingAsync(Guid userId, Guid bookingId, SubmitReviewRequest req, CancellationToken ct)
    {
        var booking = await _db.Bookings
            .Include(b => b.Review)
            .Include(b => b.Tour).ThenInclude(t => t.Provider)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct)
            ?? throw new ReviewException(ReviewError.BookingNotFound, "Booking not found.");

        if (booking.UserId != userId)
            throw new ReviewException(ReviewError.NotOwner, "You cannot review someone else's booking.");

        if (booking.Status != BookingStatus.Completed)
            throw new ReviewException(ReviewError.NotCompleted, "You can only review a completed tour.");

        if (booking.Review is not null)
            throw new ReviewException(ReviewError.AlreadyReviewed, "You already reviewed this booking.");

        var review = new Review
        {
            BookingId = booking.Id,
            UserId = userId,
            TourId = booking.TourId,
            Rating = req.Rating,
            Title = string.IsNullOrWhiteSpace(req.Title) ? null : req.Title.Trim(),
            Comment = req.Comment.Trim(),
            Source = ReviewSource.Internal,
            // Hybrid policy: verified-buyer reviews go straight to Approved.
            // (Admin can still take them down via Reject.) Imported externals can be
            // submitted with RequiresApproval=true to land in Pending instead.
            Status = ReviewStatus.Approved,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync(ct);

        await RecomputeTourRatingAsync(review.TourId, ct);
        return await BuildAdminDtoAsync(review.Id, ct)
            ?? throw new InvalidOperationException("Review disappeared after save.");
    }

    public async Task<IReadOnlyList<AdminReviewDto>> ListAdminAsync(ReviewStatus? status, CancellationToken ct)
    {
        var query = _db.Reviews.AsNoTracking().AsQueryable();
        if (status is { } s) query = query.Where(r => r.Status == s);

        var ids = await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => r.Id)
            .ToListAsync(ct);

        var list = new List<AdminReviewDto>(ids.Count);
        foreach (var id in ids)
        {
            var dto = await BuildAdminDtoAsync(id, ct);
            if (dto is not null) list.Add(dto);
        }
        return list;
    }

    public async Task<AdminReviewDto> ApproveAsync(Guid reviewId, CancellationToken ct)
        => await TransitionAsync(reviewId, ReviewStatus.Approved, ct);

    public async Task<AdminReviewDto> RejectAsync(Guid reviewId, CancellationToken ct)
        => await TransitionAsync(reviewId, ReviewStatus.Rejected, ct);

    private async Task<AdminReviewDto> TransitionAsync(Guid reviewId, ReviewStatus to, CancellationToken ct)
    {
        var review = await _db.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId, ct)
            ?? throw new ReviewException(ReviewError.ReviewNotFound, "Review not found.");
        if (review.Status == to)
        {
            // idempotent — no-op
            return await BuildAdminDtoAsync(review.Id, ct)!
                ?? throw new InvalidOperationException();
        }
        review.Status = to;
        await _db.SaveChangesAsync(ct);
        await RecomputeTourRatingAsync(review.TourId, ct);
        return await BuildAdminDtoAsync(review.Id, ct)
            ?? throw new InvalidOperationException("Review disappeared after save.");
    }

    public async Task<AdminReviewDto> ImportExternalAsync(ImportReviewRequest req, CancellationToken ct)
    {
        var tour = await _db.Tours.FirstOrDefaultAsync(t => t.Slug == req.TourSlug, ct)
            ?? throw new ReviewException(ReviewError.TourNotFound, "Tour not found.");

        var review = new Review
        {
            TourId = tour.Id,
            Rating = req.Rating,
            Title = string.IsNullOrWhiteSpace(req.Title) ? null : req.Title.Trim(),
            Comment = req.Comment.Trim(),
            ExternalAuthor = req.AuthorName.Trim(),
            Source = req.Source,
            Status = req.RequiresApproval ? ReviewStatus.Pending : ReviewStatus.Approved,
            CreatedAt = req.CreatedAt ?? DateTime.UtcNow,
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync(ct);

        if (review.Status == ReviewStatus.Approved)
            await RecomputeTourRatingAsync(review.TourId, ct);

        return await BuildAdminDtoAsync(review.Id, ct)
            ?? throw new InvalidOperationException("Review disappeared after save.");
    }

    public async Task<IReadOnlyList<ProviderReviewDto>> ListForProviderAsync(Guid userId, CancellationToken ct)
    {
        var providerId = await _db.Providers
            .Where(p => p.UserId == userId)
            .Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync(ct);
        if (providerId is null)
            throw new ReviewException(ReviewError.NotProvider, "Caller is not a provider.");

        var rows = await _db.Reviews.AsNoTracking()
            .Where(r => r.Tour.ProviderId == providerId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ProviderReviewDto(
                r.Id,
                r.Tour.Id,
                r.Tour.Slug,
                r.Tour.Title,
                r.ExternalAuthor ?? (r.User != null ? r.User.FullName : "Anonymous"),
                r.Rating,
                r.Title,
                r.Comment,
                r.Source,
                r.Status,
                r.CreatedAt))
            .ToListAsync(ct);

        return rows;
    }

    private async Task RecomputeTourRatingAsync(Guid tourId, CancellationToken ct)
    {
        var approved = await _db.Reviews
            .Where(r => r.TourId == tourId && r.Status == ReviewStatus.Approved)
            .Select(r => r.Rating)
            .ToListAsync(ct);

        var tour = await _db.Tours.FirstOrDefaultAsync(t => t.Id == tourId, ct);
        if (tour is null) return;

        if (approved.Count == 0)
        {
            tour.Rating = 0m;
            tour.ReviewCount = 0;
        }
        else
        {
            tour.Rating = Math.Round((decimal)approved.Average(), 2);
            tour.ReviewCount = approved.Count;
        }
        await _db.SaveChangesAsync(ct);
    }

    private async Task<AdminReviewDto?> BuildAdminDtoAsync(Guid reviewId, CancellationToken ct)
    {
        var r = await _db.Reviews.AsNoTracking()
            .Include(r => r.Tour).ThenInclude(t => t.Provider)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == reviewId, ct);
        if (r is null) return null;

        var author = r.ExternalAuthor ?? (r.User?.FullName ?? "Anonymous");
        return new AdminReviewDto(
            r.Id, r.BookingId, r.UserId,
            r.TourId, r.Tour.Slug, r.Tour.Title,
            r.Tour.Provider.CompanyName,
            author,
            r.Rating, r.Title, r.Comment,
            r.Source, r.Status, r.CreatedAt);
    }
}

using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Bookings;

public record TourSummaryDto(
    Guid Id,
    string Slug,
    string Title,
    string Location,
    string Duration,
    string? CoverImageUrl,
    string ProviderName);

public record PaymentSummaryDto(
    PaymentProvider Provider,
    PaymentStatus Status,
    string? ProviderPaymentId);

public record BookingDto(
    Guid Id,
    string Reference,
    BookingStatus Status,
    DateOnly Date,
    TimeOnly? StartTime,
    int Adults,
    int Children,
    decimal Subtotal,
    decimal DiscountAmount,
    decimal CommissionAmount,
    decimal TotalPrice,
    string Currency,
    string ContactName,
    string ContactEmail,
    string? ContactPhone,
    string? Notes,
    DateTime CreatedAt,
    TourSummaryDto Tour,
    PaymentSummaryDto? Payment);

public record CreateBookingResponse(
    BookingDto Booking,
    string PreferenceId,
    string InitPoint,
    string SandboxInitPoint);

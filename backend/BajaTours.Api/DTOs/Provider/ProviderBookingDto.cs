using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Provider;

public record ProviderBookingDto(
    Guid Id,
    string Reference,
    BookingStatus Status,
    DateOnly Date,
    TimeOnly? StartTime,
    int Adults,
    int Children,
    decimal TotalPrice,
    decimal CommissionAmount,
    decimal NetToProvider,
    string Currency,
    string CustomerName,
    string CustomerEmail,
    string? CustomerPhone,
    Guid TourId,
    string TourTitle,
    string TourSlug,
    PaymentStatus? PaymentStatus,
    DateTime CreatedAt);

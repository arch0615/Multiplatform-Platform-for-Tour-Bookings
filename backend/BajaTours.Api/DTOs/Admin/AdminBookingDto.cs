using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Admin;

public record AdminBookingDto(
    Guid Id,
    string Reference,
    BookingStatus Status,
    DateOnly Date,
    TimeOnly? StartTime,
    int Adults,
    int Children,
    decimal TotalPrice,
    decimal CommissionAmount,
    string Currency,
    string CustomerName,
    string CustomerEmail,
    Guid TourId,
    string TourTitle,
    Guid ProviderId,
    string ProviderName,
    PaymentStatus? PaymentStatus,
    DateTime CreatedAt);

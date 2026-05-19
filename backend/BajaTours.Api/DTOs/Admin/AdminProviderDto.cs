using System.ComponentModel.DataAnnotations;
using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Admin;

public record AdminProviderDto(
    Guid Id,
    string CompanyName,
    string OwnerFullName,
    string OwnerEmail,
    string? Rfc,
    string? Location,
    string? Description,
    decimal CommissionRate,
    bool Verified,
    ProviderStatus Status,
    int TourCount,
    int BookingCount,
    decimal LifetimeGross,
    DateTime CreatedAt);

public class SuspendProviderRequest
{
    [MaxLength(500)]
    public string? Reason { get; set; }
}

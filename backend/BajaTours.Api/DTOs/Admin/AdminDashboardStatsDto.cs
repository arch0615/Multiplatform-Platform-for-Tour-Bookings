namespace BajaTours.Api.DTOs.Admin;

public record DashboardMonthDto(
    string YearMonth,
    string Label,
    decimal Gross,
    decimal Commission,
    int Bookings);

public record AdminDashboardStatsDto(
    decimal TotalGrossLifetime,
    decimal TotalCommissionLifetime,
    int BookingsLifetime,
    int ActiveProviders,
    int PendingProviders,
    int ActiveTours,
    int TotalUsers,
    int Bookings30d,
    decimal Gross30d,
    decimal Commission30d,
    string Currency,
    IReadOnlyList<DashboardMonthDto> Monthly);

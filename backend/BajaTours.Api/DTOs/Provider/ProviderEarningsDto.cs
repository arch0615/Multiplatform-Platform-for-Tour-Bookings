namespace BajaTours.Api.DTOs.Provider;

public record EarningsMonthDto(
    string YearMonth, // "2026-05"
    string Label,     // "May 2026"
    decimal Gross,
    decimal Commission,
    decimal Net,
    int Bookings);

public record TopTourDto(
    Guid TourId,
    string Title,
    int Bookings,
    decimal Net);

public record ProviderEarningsDto(
    decimal TotalGross,
    decimal TotalCommission,
    decimal TotalNet,
    decimal PendingPayout,
    int ConfirmedCount,
    int CompletedCount,
    string Currency,
    IReadOnlyList<EarningsMonthDto> Monthly,
    IReadOnlyList<TopTourDto> TopTours);

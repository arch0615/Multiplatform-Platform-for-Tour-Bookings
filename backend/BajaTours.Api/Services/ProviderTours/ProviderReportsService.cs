using System.Globalization;
using BajaTours.Api.Data;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Provider;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Services.ProviderTours;

public interface IProviderReportsService
{
    Task<IReadOnlyList<ProviderBookingDto>> ListBookingsAsync(
        Guid userId, BookingStatus? status, DateOnly? from, DateOnly? to, CancellationToken ct);

    Task<ProviderEarningsDto> GetEarningsAsync(Guid userId, CancellationToken ct);
}

public class ProviderReportsService : IProviderReportsService
{
    private readonly AppDbContext _db;
    public ProviderReportsService(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<ProviderBookingDto>> ListBookingsAsync(
        Guid userId, BookingStatus? status, DateOnly? from, DateOnly? to, CancellationToken ct)
    {
        var providerId = await GetProviderIdAsync(userId, ct);

        var query = _db.Bookings
            .AsNoTracking()
            .Where(b => b.Tour.ProviderId == providerId);

        if (status is { } s) query = query.Where(b => b.Status == s);
        if (from is { } f) query = query.Where(b => b.Date >= f);
        if (to is { } t) query = query.Where(b => b.Date <= t);

        return await query
            .OrderByDescending(b => b.Date)
            .ThenByDescending(b => b.CreatedAt)
            .Select(b => new ProviderBookingDto(
                b.Id,
                b.Reference,
                b.Status,
                b.Date,
                b.StartTime,
                b.Adults,
                b.Children,
                b.TotalPrice,
                b.CommissionAmount,
                b.TotalPrice - b.CommissionAmount,
                b.Currency,
                b.ContactName,
                b.ContactEmail,
                b.ContactPhone,
                b.TourId,
                b.Tour.Title,
                b.Tour.Slug,
                b.Payment != null ? (PaymentStatus?)b.Payment.Status : null,
                b.CreatedAt))
            .ToListAsync(ct);
    }

    public async Task<ProviderEarningsDto> GetEarningsAsync(Guid userId, CancellationToken ct)
    {
        var providerId = await GetProviderIdAsync(userId, ct);

        // Only counts revenue-earning bookings: Confirmed + Completed
        var earningStatuses = new[] { BookingStatus.Confirmed, BookingStatus.Completed };

        var rows = await _db.Bookings
            .AsNoTracking()
            .Where(b => b.Tour.ProviderId == providerId && earningStatuses.Contains(b.Status))
            .Select(b => new
            {
                b.Status,
                b.TotalPrice,
                b.CommissionAmount,
                b.Date,
                b.TourId,
                TourTitle = b.Tour.Title,
            })
            .ToListAsync(ct);

        var totalGross = rows.Sum(r => r.TotalPrice);
        var totalCommission = rows.Sum(r => r.CommissionAmount);
        var totalNet = totalGross - totalCommission;
        var pendingPayout = rows.Where(r => r.Status == BookingStatus.Confirmed)
            .Sum(r => r.TotalPrice - r.CommissionAmount);
        var confirmedCount = rows.Count(r => r.Status == BookingStatus.Confirmed);
        var completedCount = rows.Count(r => r.Status == BookingStatus.Completed);

        // 12-month bucket aligned to today
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var first = new DateOnly(today.Year, today.Month, 1).AddMonths(-11);
        var buckets = new Dictionary<string, (decimal Gross, decimal Commission, int Bookings)>();
        for (var i = 0; i < 12; i++)
        {
            var m = first.AddMonths(i);
            buckets[$"{m.Year:0000}-{m.Month:00}"] = (0m, 0m, 0);
        }
        foreach (var r in rows)
        {
            var key = $"{r.Date.Year:0000}-{r.Date.Month:00}";
            if (!buckets.ContainsKey(key)) continue;
            var b = buckets[key];
            buckets[key] = (b.Gross + r.TotalPrice, b.Commission + r.CommissionAmount, b.Bookings + 1);
        }
        var monthlyOrdered = buckets
            .OrderBy(kvp => kvp.Key)
            .Select(kvp =>
            {
                var ym = kvp.Key;
                var parts = ym.Split('-');
                var dt = new DateTime(int.Parse(parts[0]), int.Parse(parts[1]), 1);
                var label = dt.ToString("MMM yyyy", CultureInfo.GetCultureInfo("es-MX"));
                return new EarningsMonthDto(
                    ym, label,
                    kvp.Value.Gross,
                    kvp.Value.Commission,
                    kvp.Value.Gross - kvp.Value.Commission,
                    kvp.Value.Bookings);
            })
            .ToList();

        var topTours = rows
            .GroupBy(r => new { r.TourId, r.TourTitle })
            .Select(g => new TopTourDto(
                g.Key.TourId,
                g.Key.TourTitle,
                g.Count(),
                g.Sum(x => x.TotalPrice - x.CommissionAmount)))
            .OrderByDescending(t => t.Net)
            .Take(5)
            .ToList();

        return new ProviderEarningsDto(
            totalGross, totalCommission, totalNet, pendingPayout,
            confirmedCount, completedCount, "MXN",
            monthlyOrdered, topTours);
    }

    private async Task<Guid> GetProviderIdAsync(Guid userId, CancellationToken ct)
    {
        var providerId = await _db.Providers
            .Where(p => p.UserId == userId)
            .Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync(ct);
        return providerId
            ?? throw new ProviderTourException(ProviderTourError.NotProvider, "Current user is not a provider.");
    }
}

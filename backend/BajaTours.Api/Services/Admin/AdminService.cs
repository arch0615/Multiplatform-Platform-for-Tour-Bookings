using System.Globalization;
using BajaTours.Api.Data;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Admin;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Services.Admin;

public enum AdminError { None, ProviderNotFound }

public class AdminException : Exception
{
    public AdminError Error { get; }
    public AdminException(AdminError error, string message) : base(message) => Error = error;
}

public interface IAdminService
{
    Task<IReadOnlyList<AdminProviderDto>> ListProvidersAsync(ProviderStatus? status, string? search, CancellationToken ct);
    Task<AdminProviderDto> VerifyProviderAsync(Guid providerId, CancellationToken ct);
    Task<AdminProviderDto> SuspendProviderAsync(Guid providerId, string? reason, CancellationToken ct);
    Task<IReadOnlyList<AdminBookingDto>> ListBookingsAsync(
        BookingStatus? status, Guid? providerId, DateOnly? from, DateOnly? to, CancellationToken ct);
    Task<AdminDashboardStatsDto> GetDashboardStatsAsync(CancellationToken ct);
}

public class AdminService : IAdminService
{
    private readonly AppDbContext _db;
    public AdminService(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<AdminProviderDto>> ListProvidersAsync(
        ProviderStatus? status, string? search, CancellationToken ct)
    {
        var query = _db.Providers.Include(p => p.User).AsQueryable();
        if (status is { } s) query = query.Where(p => p.Status == s);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var needle = search.Trim();
            query = query.Where(p => EF.Functions.Like(p.CompanyName, $"%{needle}%")
                || EF.Functions.Like(p.User.Email, $"%{needle}%")
                || (p.Location != null && EF.Functions.Like(p.Location, $"%{needle}%")));
        }

        var providerIds = await query
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => p.Id)
            .ToListAsync(ct);

        // Aggregate counts per provider (tour count, booking count, lifetime gross)
        // Two extra queries to keep this readable. With more scale we'd push into one
        // grouped query, but for the admin dashboard scale (~dozens of providers)
        // this is fine.
        var aggregates = await _db.Tours
            .AsNoTracking()
            .Where(t => providerIds.Contains(t.ProviderId))
            .GroupBy(t => t.ProviderId)
            .Select(g => new
            {
                ProviderId = g.Key,
                TourCount = g.Count(),
            })
            .ToDictionaryAsync(x => x.ProviderId, x => x.TourCount, ct);

        var earningStatuses = new[] { BookingStatus.Confirmed, BookingStatus.Completed };
        var bookingAggs = await _db.Bookings
            .AsNoTracking()
            .Where(b => providerIds.Contains(b.Tour.ProviderId) && earningStatuses.Contains(b.Status))
            .GroupBy(b => b.Tour.ProviderId)
            .Select(g => new
            {
                ProviderId = g.Key,
                BookingCount = g.Count(),
                Gross = g.Sum(b => b.TotalPrice),
            })
            .ToDictionaryAsync(x => x.ProviderId, x => new { x.BookingCount, x.Gross }, ct);

        var providers = await _db.Providers.Include(p => p.User)
            .Where(p => providerIds.Contains(p.Id))
            .AsNoTracking()
            .ToListAsync(ct);

        // Preserve the original ordering
        var ordered = providerIds
            .Select(id => providers.First(p => p.Id == id))
            .ToList();

        return ordered.Select(p =>
        {
            var bookAgg = bookingAggs.GetValueOrDefault(p.Id);
            return new AdminProviderDto(
                p.Id,
                p.CompanyName,
                p.User.FullName,
                p.User.Email,
                p.Rfc,
                p.Location,
                p.Description,
                p.CommissionRate,
                p.Verified,
                p.Status,
                aggregates.GetValueOrDefault(p.Id),
                bookAgg?.BookingCount ?? 0,
                bookAgg?.Gross ?? 0m,
                p.CreatedAt);
        }).ToList();
    }

    public async Task<AdminProviderDto> VerifyProviderAsync(Guid providerId, CancellationToken ct)
    {
        var provider = await _db.Providers.FirstOrDefaultAsync(p => p.Id == providerId, ct)
            ?? throw new AdminException(AdminError.ProviderNotFound, "Provider not found.");

        provider.Verified = true;
        provider.Status = ProviderStatus.Active;
        provider.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return await SingleProviderAsync(providerId, ct);
    }

    public async Task<AdminProviderDto> SuspendProviderAsync(Guid providerId, string? reason, CancellationToken ct)
    {
        var provider = await _db.Providers.FirstOrDefaultAsync(p => p.Id == providerId, ct)
            ?? throw new AdminException(AdminError.ProviderNotFound, "Provider not found.");

        provider.Status = ProviderStatus.Suspended;
        provider.UpdatedAt = DateTime.UtcNow;
        // Suspension reason gets dropped for now; uncomment when we add a Notes/AuditLog field.
        _ = reason;
        await _db.SaveChangesAsync(ct);
        return await SingleProviderAsync(providerId, ct);
    }

    private async Task<AdminProviderDto> SingleProviderAsync(Guid providerId, CancellationToken ct)
    {
        var list = await ListProvidersAsync(null, null, ct);
        return list.First(p => p.Id == providerId);
    }

    public async Task<IReadOnlyList<AdminBookingDto>> ListBookingsAsync(
        BookingStatus? status, Guid? providerId, DateOnly? from, DateOnly? to, CancellationToken ct)
    {
        var query = _db.Bookings.AsNoTracking().AsQueryable();
        if (status is { } s) query = query.Where(b => b.Status == s);
        if (providerId is { } pid) query = query.Where(b => b.Tour.ProviderId == pid);
        if (from is { } f) query = query.Where(b => b.Date >= f);
        if (to is { } t) query = query.Where(b => b.Date <= t);

        return await query
            .OrderByDescending(b => b.CreatedAt)
            .Take(500)
            .Select(b => new AdminBookingDto(
                b.Id,
                b.Reference,
                b.Status,
                b.Date,
                b.StartTime,
                b.Adults,
                b.Children,
                b.TotalPrice,
                b.CommissionAmount,
                b.Currency,
                b.ContactName,
                b.ContactEmail,
                b.TourId,
                b.Tour.Title,
                b.Tour.ProviderId,
                b.Tour.Provider.CompanyName,
                b.Payment != null ? (PaymentStatus?)b.Payment.Status : null,
                b.CreatedAt))
            .ToListAsync(ct);
    }

    public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync(CancellationToken ct)
    {
        var earningStatuses = new[] { BookingStatus.Confirmed, BookingStatus.Completed };

        var lifetime = await _db.Bookings.AsNoTracking()
            .Where(b => earningStatuses.Contains(b.Status))
            .Select(b => new { b.TotalPrice, b.CommissionAmount })
            .ToListAsync(ct);

        var totalGross = lifetime.Sum(b => b.TotalPrice);
        var totalCommission = lifetime.Sum(b => b.CommissionAmount);
        var bookingsLifetime = lifetime.Count;

        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
        var last30 = await _db.Bookings.AsNoTracking()
            .Where(b => earningStatuses.Contains(b.Status) && b.CreatedAt >= thirtyDaysAgo)
            .Select(b => new { b.TotalPrice, b.CommissionAmount })
            .ToListAsync(ct);

        var bookings30d = last30.Count;
        var gross30d = last30.Sum(b => b.TotalPrice);
        var commission30d = last30.Sum(b => b.CommissionAmount);

        var activeProviders = await _db.Providers.CountAsync(p => p.Status == ProviderStatus.Active, ct);
        var pendingProviders = await _db.Providers.CountAsync(p => p.Status == ProviderStatus.PendingVerification, ct);
        var activeTours = await _db.Tours.CountAsync(t => t.Status == TourStatus.Active, ct);
        var totalUsers = await _db.Users.CountAsync(ct);

        // 12-month bucket aligned to today
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var first = new DateOnly(today.Year, today.Month, 1).AddMonths(-11);
        var monthlyRows = await _db.Bookings.AsNoTracking()
            .Where(b => earningStatuses.Contains(b.Status))
            .Select(b => new { b.Date, b.TotalPrice, b.CommissionAmount })
            .ToListAsync(ct);

        var buckets = new Dictionary<string, (decimal Gross, decimal Commission, int N)>();
        for (var i = 0; i < 12; i++)
        {
            var m = first.AddMonths(i);
            buckets[$"{m.Year:0000}-{m.Month:00}"] = (0m, 0m, 0);
        }
        foreach (var r in monthlyRows)
        {
            var key = $"{r.Date.Year:0000}-{r.Date.Month:00}";
            if (!buckets.ContainsKey(key)) continue;
            var b = buckets[key];
            buckets[key] = (b.Gross + r.TotalPrice, b.Commission + r.CommissionAmount, b.N + 1);
        }
        var monthly = buckets
            .OrderBy(kvp => kvp.Key)
            .Select(kvp =>
            {
                var parts = kvp.Key.Split('-');
                var dt = new DateTime(int.Parse(parts[0]), int.Parse(parts[1]), 1);
                var label = dt.ToString("MMM yyyy", CultureInfo.CurrentCulture);
                return new DashboardMonthDto(kvp.Key, label, kvp.Value.Gross, kvp.Value.Commission, kvp.Value.N);
            })
            .ToList();

        return new AdminDashboardStatsDto(
            totalGross, totalCommission, bookingsLifetime,
            activeProviders, pendingProviders, activeTours, totalUsers,
            bookings30d, gross30d, commission30d,
            "MXN", monthly);
    }
}

using BajaTours.Api.Data;
using BajaTours.Api.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Services.Bookings;

/// <summary>
/// Hourly tick that flips Confirmed bookings whose tour date has passed to Completed,
/// stamping CompletedAt. Lets the review-submission flow gate on Booking.Status == Completed.
/// </summary>
public class BookingCompletionService : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromHours(1);

    private readonly IServiceProvider _services;
    private readonly ILogger<BookingCompletionService> _logger;

    public BookingCompletionService(IServiceProvider services, ILogger<BookingCompletionService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // First run shortly after startup; then on the hourly cadence.
        await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken).ConfigureAwait(false);
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await RunOnceAsync(stoppingToken);
            }
            catch (OperationCanceledException) { throw; }
            catch (Exception ex)
            {
                _logger.LogError(ex, "BookingCompletionService tick failed");
            }

            try { await Task.Delay(Interval, stoppingToken); }
            catch (OperationCanceledException) { break; }
        }
    }

    private async Task RunOnceAsync(CancellationToken ct)
    {
        using var scope = _services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var ripe = await db.Bookings
            .Where(b => b.Status == BookingStatus.Confirmed && b.Date < today)
            .ToListAsync(ct);

        if (ripe.Count == 0) return;

        var now = DateTime.UtcNow;
        foreach (var b in ripe)
        {
            b.Status = BookingStatus.Completed;
            b.CompletedAt = now;
            b.UpdatedAt = now;
        }
        await db.SaveChangesAsync(ct);
        _logger.LogInformation("BookingCompletionService: marked {Count} bookings as Completed", ripe.Count);
    }
}

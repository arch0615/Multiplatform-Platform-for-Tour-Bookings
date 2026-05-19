using BajaTours.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Provider> Providers => Set<Provider>();
    public DbSet<Tour> Tours => Set<Tour>();
    public DbSet<TourImage> TourImages => Set<TourImage>();
    public DbSet<TourAvailability> TourAvailability => Set<TourAvailability>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<AuthToken> AuthTokens => Set<AuthToken>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.Property(u => u.FullName).HasMaxLength(200).IsRequired();
            e.Property(u => u.Phone).HasMaxLength(32);
            e.Property(u => u.PreferredLanguage).HasMaxLength(8);
        });

        modelBuilder.Entity<Provider>(e =>
        {
            e.HasIndex(p => p.UserId).IsUnique();
            e.Property(p => p.CompanyName).HasMaxLength(200).IsRequired();
            e.Property(p => p.Rfc).HasMaxLength(32);
            e.Property(p => p.CommissionRate).HasPrecision(5, 4);
            e.HasOne(p => p.User)
                .WithOne(u => u.Provider)
                .HasForeignKey<Provider>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Tour>(e =>
        {
            e.HasIndex(t => t.Slug).IsUnique();
            e.HasIndex(t => new { t.Category, t.Location });
            e.Property(t => t.Slug).HasMaxLength(160).IsRequired();
            e.Property(t => t.Title).HasMaxLength(200).IsRequired();
            e.Property(t => t.Location).HasMaxLength(120).IsRequired();
            e.Property(t => t.Duration).HasMaxLength(64);
            e.Property(t => t.Languages).HasMaxLength(32);
            e.Property(t => t.PriceAdult).HasPrecision(10, 2);
            e.Property(t => t.PriceChild).HasPrecision(10, 2);
            e.Property(t => t.Rating).HasPrecision(3, 2);
            e.HasOne(t => t.Provider)
                .WithMany(p => p.Tours)
                .HasForeignKey(t => t.ProviderId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<TourImage>(e =>
        {
            e.HasOne(i => i.Tour)
                .WithMany(t => t.Images)
                .HasForeignKey(i => i.TourId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TourAvailability>(e =>
        {
            e.HasIndex(a => new { a.TourId, a.Date }).IsUnique();
            e.Property(a => a.PriceOverride).HasPrecision(10, 2);
            e.HasOne(a => a.Tour)
                .WithMany(t => t.Availability)
                .HasForeignKey(a => a.TourId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Booking>(e =>
        {
            e.HasIndex(b => b.Reference).IsUnique();
            e.Property(b => b.Reference).HasMaxLength(32).IsRequired();
            e.Property(b => b.Currency).HasMaxLength(3);
            e.Property(b => b.Subtotal).HasPrecision(10, 2);
            e.Property(b => b.CommissionAmount).HasPrecision(10, 2);
            e.Property(b => b.TotalPrice).HasPrecision(10, 2);
            e.Property(b => b.DiscountAmount).HasPrecision(10, 2);
            e.Property(b => b.ContactName).HasMaxLength(200);
            e.Property(b => b.ContactEmail).HasMaxLength(256);
            e.Property(b => b.CancelReason).HasMaxLength(64);
            e.Property(b => b.CancelComment).HasMaxLength(500);
            e.HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(b => b.Tour)
                .WithMany(t => t.Bookings)
                .HasForeignKey(b => b.TourId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Payment>(e =>
        {
            e.Property(p => p.Amount).HasPrecision(10, 2);
            e.Property(p => p.Currency).HasMaxLength(3);
            e.HasOne(p => p.Booking)
                .WithOne(b => b.Payment)
                .HasForeignKey<Payment>(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Review>(e =>
        {
            e.HasIndex(r => new { r.TourId, r.Status });
            e.HasOne(r => r.Tour)
                .WithMany(t => t.Reviews)
                .HasForeignKey(r => r.TourId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(r => r.Booking)
                .WithOne(b => b.Review)
                .HasForeignKey<Review>(r => r.BookingId)
                .OnDelete(DeleteBehavior.SetNull);
            e.HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Favorite>(e =>
        {
            e.HasKey(f => new { f.UserId, f.TourId });
            e.HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(f => f.Tour)
                .WithMany(t => t.Favorites)
                .HasForeignKey(f => f.TourId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Coupon>(e =>
        {
            e.HasIndex(c => c.Code).IsUnique();
            e.Property(c => c.Code).HasMaxLength(32).IsRequired();
            e.Property(c => c.DiscountPercent).HasPrecision(5, 4);
            e.Property(c => c.DiscountAmount).HasPrecision(10, 2);
        });

        modelBuilder.Entity<RefreshToken>(e =>
        {
            e.HasIndex(r => r.TokenHash).IsUnique();
            e.HasIndex(r => r.UserId);
            e.Property(r => r.TokenHash).HasMaxLength(128).IsRequired();
            e.Property(r => r.CreatedByIp).HasMaxLength(64);
            e.Property(r => r.RevokedByIp).HasMaxLength(64);
            e.Property(r => r.ReplacedByTokenHash).HasMaxLength(128);
            e.Ignore(r => r.IsActive);
            e.HasOne(r => r.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AuthToken>(e =>
        {
            e.HasIndex(t => t.TokenHash).IsUnique();
            e.HasIndex(t => new { t.UserId, t.Purpose });
            e.Property(t => t.TokenHash).HasMaxLength(128).IsRequired();
            e.Ignore(t => t.IsUsable);
            e.HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AuditLog>(e =>
        {
            e.HasIndex(a => a.At);
            e.HasIndex(a => a.ActorUserId);
            e.Property(a => a.Method).HasMaxLength(8).IsRequired();
            e.Property(a => a.Path).HasMaxLength(512).IsRequired();
            e.Property(a => a.RouteValues).HasMaxLength(1024);
            e.Property(a => a.RequestBody).HasMaxLength(2048);
            e.Property(a => a.ActorEmail).HasMaxLength(256);
            e.Property(a => a.Ip).HasMaxLength(64);
        });
    }
}

using System.Security.Cryptography;
using System.Text;
using BajaTours.Api.Configuration;
using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Auth;
using BajaTours.Api.Services.Notifications;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BajaTours.Api.Services.Auth;

public interface IAuthService
{
    Task<AuthResponse> RegisterClientAsync(RegisterRequest req, string? ip, CancellationToken ct);
    Task<AuthResponse> RegisterProviderAsync(RegisterProviderRequest req, string? ip, CancellationToken ct);
    Task<AuthResponse> LoginAsync(LoginRequest req, string? ip, CancellationToken ct);
    Task<AuthResponse> RefreshAsync(string refreshToken, string? ip, CancellationToken ct);
    Task LogoutAsync(string refreshToken, string? ip, CancellationToken ct);
    Task<UserDto> GetMeAsync(Guid userId, CancellationToken ct);
    Task<UserDto> VerifyEmailAsync(string rawToken, CancellationToken ct);
    Task RequestPasswordResetAsync(string email, CancellationToken ct);
    Task ResetPasswordAsync(string rawToken, string newPassword, CancellationToken ct);
}

public class AuthService : IAuthService
{
    private const int VerifyEmailValidDays = 7;
    private const int PasswordResetValidHours = 1;

    private readonly AppDbContext _db;
    private readonly IPasswordHasher<User> _hasher;
    private readonly IJwtTokenService _jwt;
    private readonly IEmailService _email;
    private readonly PaymentsOptions _payments;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        AppDbContext db,
        IPasswordHasher<User> hasher,
        IJwtTokenService jwt,
        IEmailService email,
        IOptions<PaymentsOptions> payments,
        ILogger<AuthService> logger)
    {
        _db = db;
        _hasher = hasher;
        _jwt = jwt;
        _email = email;
        _payments = payments.Value;
        _logger = logger;
    }

    public async Task<AuthResponse> RegisterClientAsync(RegisterRequest req, string? ip, CancellationToken ct)
    {
        await EnsureEmailAvailableAsync(req.Email, ct);

        var user = new User
        {
            Email = req.Email.Trim().ToLowerInvariant(),
            FullName = req.FullName.Trim(),
            Phone = req.Phone,
            PreferredLanguage = req.PreferredLanguage ?? "es",
            Role = UserRole.Client
        };
        user.PasswordHash = _hasher.HashPassword(user, req.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        await TrySendVerifyEmailAsync(user, ct);
        return await IssueTokensAsync(user, providerId: null, providerStatus: null, ip, ct);
    }

    public async Task<AuthResponse> RegisterProviderAsync(RegisterProviderRequest req, string? ip, CancellationToken ct)
    {
        await EnsureEmailAvailableAsync(req.Email, ct);

        var user = new User
        {
            Email = req.Email.Trim().ToLowerInvariant(),
            FullName = req.FullName.Trim(),
            Phone = req.Phone,
            PreferredLanguage = req.PreferredLanguage ?? "es",
            Role = UserRole.Provider
        };
        user.PasswordHash = _hasher.HashPassword(user, req.Password);

        var provider = new Provider
        {
            UserId = user.Id,
            CompanyName = req.CompanyName.Trim(),
            Rfc = req.Rfc,
            Location = req.Location,
            ContactPhone = req.ContactPhone,
            Status = ProviderStatus.PendingVerification
        };

        _db.Users.Add(user);
        _db.Providers.Add(provider);
        await _db.SaveChangesAsync(ct);

        await TrySendVerifyEmailAsync(user, ct);
        return await IssueTokensAsync(user, provider.Id, provider.Status, ip, ct);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest req, string? ip, CancellationToken ct)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await _db.Users
            .Include(u => u.Provider)
            .FirstOrDefaultAsync(u => u.Email == email, ct);

        if (user is null)
            throw new AuthException(AuthError.InvalidCredentials, "Invalid email or password.");

        var verify = _hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
        if (verify == PasswordVerificationResult.Failed)
            throw new AuthException(AuthError.InvalidCredentials, "Invalid email or password.");

        if (verify == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _hasher.HashPassword(user, req.Password);
            await _db.SaveChangesAsync(ct);
        }

        return await IssueTokensAsync(user, user.Provider?.Id, user.Provider?.Status, ip, ct);
    }

    public async Task<AuthResponse> RefreshAsync(string refreshToken, string? ip, CancellationToken ct)
    {
        var hash = _jwt.HashRefreshToken(refreshToken);
        var stored = await _db.RefreshTokens
            .Include(r => r.User).ThenInclude(u => u.Provider)
            .FirstOrDefaultAsync(r => r.TokenHash == hash, ct);

        if (stored is null || !stored.IsActive)
            throw new AuthException(AuthError.InvalidRefreshToken, "Refresh token is invalid or expired.");

        var (newToken, newHash, newExpires) = _jwt.IssueRefreshToken();

        stored.RevokedAt = DateTime.UtcNow;
        stored.RevokedByIp = ip;
        stored.ReplacedByTokenHash = newHash;

        var replacement = new RefreshToken
        {
            UserId = stored.UserId,
            TokenHash = newHash,
            ExpiresAt = newExpires,
            CreatedByIp = ip
        };
        _db.RefreshTokens.Add(replacement);

        var (accessToken, accessExpires) = _jwt.IssueAccessToken(stored.User);
        await _db.SaveChangesAsync(ct);

        return new AuthResponse(
            accessToken,
            newToken,
            accessExpires,
            newExpires,
            BuildUserDto(stored.User, stored.User.Provider?.Id, stored.User.Provider?.Status));
    }

    public async Task LogoutAsync(string refreshToken, string? ip, CancellationToken ct)
    {
        var hash = _jwt.HashRefreshToken(refreshToken);
        var stored = await _db.RefreshTokens.FirstOrDefaultAsync(r => r.TokenHash == hash, ct);
        if (stored is null || !stored.IsActive) return;

        stored.RevokedAt = DateTime.UtcNow;
        stored.RevokedByIp = ip;
        await _db.SaveChangesAsync(ct);
    }

    public async Task<UserDto> GetMeAsync(Guid userId, CancellationToken ct)
    {
        var user = await _db.Users
            .Include(u => u.Provider)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, ct)
            ?? throw new AuthException(AuthError.UserNotFound, "User not found.");

        return BuildUserDto(user, user.Provider?.Id, user.Provider?.Status);
    }

    public async Task<UserDto> VerifyEmailAsync(string rawToken, CancellationToken ct)
    {
        var hash = HashAuthToken(rawToken);
        var record = await _db.AuthTokens
            .Include(t => t.User).ThenInclude(u => u.Provider)
            .FirstOrDefaultAsync(t => t.TokenHash == hash
                && t.Purpose == AuthTokenPurpose.EmailVerification, ct);

        if (record is null || !record.IsUsable)
            throw new AuthException(AuthError.InvalidToken, "El enlace de verificación es inválido o expiró.");

        record.ConsumedAt = DateTime.UtcNow;
        record.User.EmailVerified = true;
        record.User.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return BuildUserDto(record.User, record.User.Provider?.Id, record.User.Provider?.Status);
    }

    public async Task RequestPasswordResetAsync(string email, CancellationToken ct)
    {
        var normalized = email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == normalized, ct);
        if (user is null)
        {
            _logger.LogInformation("Password reset requested for unknown email {Email}", normalized);
            return; // intentionally silent — prevents account-enumeration attacks
        }

        await InvalidateExistingTokensAsync(user.Id, AuthTokenPurpose.PasswordReset, ct);
        var (rawToken, tokenHash) = GenerateRawTokenWithHash();
        _db.AuthTokens.Add(new AuthToken
        {
            UserId = user.Id,
            Purpose = AuthTokenPurpose.PasswordReset,
            TokenHash = tokenHash,
            ExpiresAt = DateTime.UtcNow.AddHours(PasswordResetValidHours),
        });
        await _db.SaveChangesAsync(ct);

        var link = $"{_payments.FrontendBaseUrl.TrimEnd('/')}/restablecer-contrasena/{rawToken}";
        try
        {
            await _email.SendAsync(EmailFlowTemplates.PasswordReset(user, link), ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password-reset email to {Email}", user.Email);
        }
    }

    public async Task ResetPasswordAsync(string rawToken, string newPassword, CancellationToken ct)
    {
        var hash = HashAuthToken(rawToken);
        var record = await _db.AuthTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.TokenHash == hash
                && t.Purpose == AuthTokenPurpose.PasswordReset, ct);

        if (record is null || !record.IsUsable)
            throw new AuthException(AuthError.InvalidToken, "El enlace de restablecimiento es inválido o expiró.");

        record.ConsumedAt = DateTime.UtcNow;
        record.User.PasswordHash = _hasher.HashPassword(record.User, newPassword);
        record.User.UpdatedAt = DateTime.UtcNow;

        // Revoke all active refresh tokens — forces re-login on every device
        var activeRefresh = await _db.RefreshTokens
            .Where(r => r.UserId == record.UserId && r.RevokedAt == null)
            .ToListAsync(ct);
        foreach (var rt in activeRefresh)
        {
            rt.RevokedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(ct);
    }

    private async Task TrySendVerifyEmailAsync(User user, CancellationToken ct)
    {
        try
        {
            await InvalidateExistingTokensAsync(user.Id, AuthTokenPurpose.EmailVerification, ct);
            var (rawToken, tokenHash) = GenerateRawTokenWithHash();
            _db.AuthTokens.Add(new AuthToken
            {
                UserId = user.Id,
                Purpose = AuthTokenPurpose.EmailVerification,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddDays(VerifyEmailValidDays),
            });
            await _db.SaveChangesAsync(ct);

            var link = $"{_payments.FrontendBaseUrl.TrimEnd('/')}/verificar-email/{rawToken}";
            await _email.SendAsync(EmailFlowTemplates.EmailVerify(user, link), ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send verify-email to {Email}", user.Email);
        }
    }

    private async Task InvalidateExistingTokensAsync(Guid userId, AuthTokenPurpose purpose, CancellationToken ct)
    {
        var active = await _db.AuthTokens
            .Where(t => t.UserId == userId && t.Purpose == purpose && t.ConsumedAt == null)
            .ToListAsync(ct);
        var now = DateTime.UtcNow;
        foreach (var t in active) t.ConsumedAt = now;
    }

    private static (string raw, string hash) GenerateRawTokenWithHash()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        var raw = Convert.ToBase64String(bytes)
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');
        return (raw, HashAuthToken(raw));
    }

    private static string HashAuthToken(string raw)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
        return Convert.ToHexString(bytes);
    }

    private async Task EnsureEmailAvailableAsync(string email, CancellationToken ct)
    {
        var normalized = email.Trim().ToLowerInvariant();
        var exists = await _db.Users.AnyAsync(u => u.Email == normalized, ct);
        if (exists)
            throw new AuthException(AuthError.EmailAlreadyRegistered, "Email is already registered.");
    }

    private async Task<AuthResponse> IssueTokensAsync(User user, Guid? providerId, ProviderStatus? providerStatus, string? ip, CancellationToken ct)
    {
        var (accessToken, accessExpires) = _jwt.IssueAccessToken(user);
        var (refreshToken, refreshHash, refreshExpires) = _jwt.IssueRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshHash,
            ExpiresAt = refreshExpires,
            CreatedByIp = ip
        });
        await _db.SaveChangesAsync(ct);

        return new AuthResponse(
            accessToken,
            refreshToken,
            accessExpires,
            refreshExpires,
            BuildUserDto(user, providerId, providerStatus));
    }

    private static UserDto BuildUserDto(User user, Guid? providerId, ProviderStatus? providerStatus) =>
        new(user.Id, user.Email, user.FullName, user.Phone, user.AvatarUrl,
            user.Role, user.PreferredLanguage, user.EmailVerified, providerId, providerStatus);
}

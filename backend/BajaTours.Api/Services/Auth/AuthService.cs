using BajaTours.Api.Data;
using BajaTours.Api.Domain.Entities;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.DTOs.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BajaTours.Api.Services.Auth;

public interface IAuthService
{
    Task<AuthResponse> RegisterClientAsync(RegisterRequest req, string? ip, CancellationToken ct);
    Task<AuthResponse> RegisterProviderAsync(RegisterProviderRequest req, string? ip, CancellationToken ct);
    Task<AuthResponse> LoginAsync(LoginRequest req, string? ip, CancellationToken ct);
    Task<AuthResponse> RefreshAsync(string refreshToken, string? ip, CancellationToken ct);
    Task LogoutAsync(string refreshToken, string? ip, CancellationToken ct);
    Task<UserDto> GetMeAsync(Guid userId, CancellationToken ct);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher<User> _hasher;
    private readonly IJwtTokenService _jwt;

    public AuthService(AppDbContext db, IPasswordHasher<User> hasher, IJwtTokenService jwt)
    {
        _db = db;
        _hasher = hasher;
        _jwt = jwt;
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

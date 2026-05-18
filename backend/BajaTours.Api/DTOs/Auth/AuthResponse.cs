using BajaTours.Api.Domain.Enums;

namespace BajaTours.Api.DTOs.Auth;

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    DateTime RefreshTokenExpiresAt,
    UserDto User);

public record UserDto(
    Guid Id,
    string Email,
    string FullName,
    string? Phone,
    string? AvatarUrl,
    UserRole Role,
    string PreferredLanguage,
    bool EmailVerified,
    Guid? ProviderId,
    ProviderStatus? ProviderStatus);

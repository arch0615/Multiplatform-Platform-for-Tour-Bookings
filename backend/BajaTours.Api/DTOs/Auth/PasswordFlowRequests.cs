using System.ComponentModel.DataAnnotations;

namespace BajaTours.Api.DTOs.Auth;

public class VerifyEmailRequest
{
    [Required, MaxLength(256)]
    public string Token { get; set; } = string.Empty;
}

public class ForgotPasswordRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    [Required, MaxLength(256)]
    public string Token { get; set; } = string.Empty;

    [Required, MinLength(8), MaxLength(128)]
    public string NewPassword { get; set; } = string.Empty;
}

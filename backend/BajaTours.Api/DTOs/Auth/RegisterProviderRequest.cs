using System.ComponentModel.DataAnnotations;

namespace BajaTours.Api.DTOs.Auth;

public class RegisterProviderRequest : RegisterRequest
{
    [Required, MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [MaxLength(32)]
    public string? Rfc { get; set; }

    [MaxLength(120)]
    public string? Location { get; set; }

    [MaxLength(32)]
    public string? ContactPhone { get; set; }
}

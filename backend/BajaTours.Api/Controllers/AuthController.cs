using System.Security.Claims;
using BajaTours.Api.DTOs.Auth;
using BajaTours.Api.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BajaTours.Api.Controllers;

[ApiController]
[Route("api/auth")]
[EnableRateLimiting("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("register")]
    [EnableRateLimiting("auth-strict")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest req, CancellationToken ct)
    {
        try
        {
            var result = await _auth.RegisterClientAsync(req, GetIp(), ct);
            return Ok(result);
        }
        catch (AuthException ex) when (ex.Error == AuthError.EmailAlreadyRegistered)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpPost("register/provider")]
    [EnableRateLimiting("auth-strict")]
    public async Task<ActionResult<AuthResponse>> RegisterProvider([FromBody] RegisterProviderRequest req, CancellationToken ct)
    {
        try
        {
            var result = await _auth.RegisterProviderAsync(req, GetIp(), ct);
            return Ok(result);
        }
        catch (AuthException ex) when (ex.Error == AuthError.EmailAlreadyRegistered)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpPost("login")]
    [EnableRateLimiting("auth-strict")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req, CancellationToken ct)
    {
        try
        {
            var result = await _auth.LoginAsync(req, GetIp(), ct);
            return Ok(result);
        }
        catch (AuthException ex) when (ex.Error == AuthError.InvalidCredentials)
        {
            return Unauthorized(new { error = ex.Message });
        }
        catch (AuthException ex) when (ex.Error == AuthError.AccountLocked)
        {
            // 429 communicates "you've been rate-limited" cleanly to the SPA
            return StatusCode(StatusCodes.Status429TooManyRequests, new { error = ex.Message });
        }
    }

    [HttpPost("refresh")]
    [EnableRateLimiting("auth-strict")]
    public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshRequest req, CancellationToken ct)
    {
        try
        {
            var result = await _auth.RefreshAsync(req.RefreshToken, GetIp(), ct);
            return Ok(result);
        }
        catch (AuthException ex) when (ex.Error == AuthError.InvalidRefreshToken)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] RefreshRequest req, CancellationToken ct)
    {
        await _auth.LogoutAsync(req.RefreshToken, GetIp(), ct);
        return NoContent();
    }

    [HttpPost("verify-email")]
    [EnableRateLimiting("auth-strict")]
    public async Task<ActionResult<UserDto>> VerifyEmail([FromBody] VerifyEmailRequest req, CancellationToken ct)
    {
        try
        {
            var me = await _auth.VerifyEmailAsync(req.Token, ct);
            return Ok(me);
        }
        catch (AuthException ex) when (ex.Error == AuthError.InvalidToken)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("forgot-password")]
    [EnableRateLimiting("auth-strict")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req, CancellationToken ct)
    {
        await _auth.RequestPasswordResetAsync(req.Email, ct);
        // Always 202 — never reveal whether the email exists
        return Accepted();
    }

    [HttpPost("reset-password")]
    [EnableRateLimiting("auth-strict")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req, CancellationToken ct)
    {
        try
        {
            await _auth.ResetPasswordAsync(req.Token, req.NewPassword, ct);
            return NoContent();
        }
        catch (AuthException ex) when (ex.Error == AuthError.InvalidToken)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Me(CancellationToken ct)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? User.FindFirstValue("sub");
        if (!Guid.TryParse(sub, out var userId))
            return Unauthorized();

        try
        {
            var me = await _auth.GetMeAsync(userId, ct);
            return Ok(me);
        }
        catch (AuthException ex) when (ex.Error == AuthError.UserNotFound)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    private string? GetIp() => HttpContext.Connection.RemoteIpAddress?.ToString();
}

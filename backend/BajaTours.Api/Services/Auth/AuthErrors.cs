namespace BajaTours.Api.Services.Auth;

public enum AuthError
{
    None = 0,
    EmailAlreadyRegistered,
    InvalidCredentials,
    InvalidRefreshToken,
    UserNotFound,
    InvalidToken
}

public class AuthException : Exception
{
    public AuthError Error { get; }

    public AuthException(AuthError error, string message) : base(message)
    {
        Error = error;
    }
}

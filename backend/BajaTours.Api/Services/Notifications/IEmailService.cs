namespace BajaTours.Api.Services.Notifications;

public record EmailRecipient(string Address, string? Name = null);

public record EmailMessage(
    EmailRecipient To,
    string Subject,
    string HtmlBody,
    string TextBody,
    EmailRecipient? Cc = null,
    string? ReplyTo = null);

public interface IEmailService
{
    Task SendAsync(EmailMessage message, CancellationToken ct = default);
}

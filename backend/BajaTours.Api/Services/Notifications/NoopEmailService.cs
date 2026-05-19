namespace BajaTours.Api.Services.Notifications;

/// <summary>
/// Default email service for dev / no-config scenarios. Logs the full message
/// so you can see what would have been sent without standing up a real SMTP.
/// </summary>
public class NoopEmailService : IEmailService
{
    private readonly ILogger<NoopEmailService> _logger;
    public NoopEmailService(ILogger<NoopEmailService> logger) => _logger = logger;

    public Task SendAsync(EmailMessage message, CancellationToken ct = default)
    {
        _logger.LogInformation(
            "[NOOP EMAIL] To: {Name} <{Address}> | Subject: {Subject}\n--- text/plain ---\n{Text}",
            message.To.Name ?? "", message.To.Address, message.Subject, message.TextBody);
        return Task.CompletedTask;
    }
}

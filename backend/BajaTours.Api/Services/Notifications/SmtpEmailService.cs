using BajaTours.Api.Configuration;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace BajaTours.Api.Services.Notifications;

public class SmtpEmailService : IEmailService
{
    private readonly EmailOptions _options;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IOptions<NotificationsOptions> options, ILogger<SmtpEmailService> logger)
    {
        _options = options.Value.Email;
        _logger = logger;
    }

    public async Task SendAsync(EmailMessage message, CancellationToken ct = default)
    {
        var mime = new MimeMessage();
        mime.From.Add(new MailboxAddress(_options.FromName, _options.FromAddress));
        mime.To.Add(new MailboxAddress(message.To.Name ?? message.To.Address, message.To.Address));
        if (message.Cc is { } cc)
            mime.Cc.Add(new MailboxAddress(cc.Name ?? cc.Address, cc.Address));
        if (!string.IsNullOrWhiteSpace(message.ReplyTo))
            mime.ReplyTo.Add(MailboxAddress.Parse(message.ReplyTo));

        mime.Subject = message.Subject;
        mime.Body = new BodyBuilder
        {
            HtmlBody = message.HtmlBody,
            TextBody = message.TextBody,
        }.ToMessageBody();

        var smtp = _options.Smtp;
        using var client = new SmtpClient();

        var socketOption = smtp.UseStartTls
            ? SecureSocketOptions.StartTls
            : (smtp.Port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.Auto);

        try
        {
            await client.ConnectAsync(smtp.Host, smtp.Port, socketOption, ct);
            if (!string.IsNullOrWhiteSpace(smtp.Username))
            {
                await client.AuthenticateAsync(smtp.Username, smtp.Password, ct);
            }
            await client.SendAsync(mime, ct);
        }
        finally
        {
            if (client.IsConnected) await client.DisconnectAsync(true, ct);
        }

        _logger.LogInformation("Email sent to {To} subject {Subject}", message.To.Address, message.Subject);
    }
}

namespace BajaTours.Api.Configuration;

public class NotificationsOptions
{
    public const string SectionName = "Notifications";

    public EmailOptions Email { get; set; } = new();
    public WhatsAppOptions WhatsApp { get; set; } = new();
}

public class EmailOptions
{
    /// <summary>"Noop" (default, logs only) or "Smtp" (MailKit via SMTP).</summary>
    public string Provider { get; set; } = "Noop";
    public string FromAddress { get; set; } = "no-reply@bajatours.mx";
    public string FromName { get; set; } = "Baja Tours";
    public SmtpOptions Smtp { get; set; } = new();
}

public class SmtpOptions
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool UseStartTls { get; set; } = true;
}

public class WhatsAppOptions
{
    public string Provider { get; set; } = "twilio";
    public string AccountSid { get; set; } = string.Empty;
    public string AuthToken { get; set; } = string.Empty;
    public string FromNumber { get; set; } = string.Empty;
}

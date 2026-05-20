using System.Globalization;
using System.Net;
using BajaTours.Api.Domain.Entities;

namespace BajaTours.Api.Services.Notifications;

// Recipient-language helper. Path A localization: each template takes a `language`
// string ("es" or "en"), resolves a culture for currency formatting, and branches
// inline on `en` for the user-facing strings. Spanish stays the default.
internal static class EmailLocale
{
    public static readonly CultureInfo SpanishMx = CultureInfo.GetCultureInfo("es-MX");
    public static readonly CultureInfo EnglishUs = CultureInfo.GetCultureInfo("en-US");

    public static (CultureInfo culture, bool isEn) Resolve(string? language)
    {
        var isEn = string.Equals(language, "en", StringComparison.OrdinalIgnoreCase)
                   || (language is not null && language.StartsWith("en-", StringComparison.OrdinalIgnoreCase));
        return isEn ? (EnglishUs, true) : (SpanishMx, false);
    }
}

public static class EmailFlowTemplates
{
    public static EmailMessage EmailVerify(User user, string verifyLink, string? language = null)
    {
        var (_, isEn) = EmailLocale.Resolve(language ?? user.PreferredLanguage);
        var name = string.IsNullOrWhiteSpace(user.FullName) ? "" : user.FullName;
        var nameEnc = WebUtility.HtmlEncode(name);
        var emailEnc = WebUtility.HtmlEncode(user.Email);

        var subject = isEn ? "Confirm your email — Baja Tours" : "Confirma tu correo — Baja Tours";
        var greeting = isEn ? $"Hi {name}," : $"Hola {name},";
        var intro = isEn
            ? "Thanks for creating your Baja Tours account. To activate it, confirm your email by clicking the link below (valid for 7 days):"
            : "Gracias por crear tu cuenta en Baja Tours. Para activarla, confirma tu correo dando clic en este enlace (válido por 7 días):";
        var ignore = isEn
            ? "If you didn't create this account, ignore this email."
            : "Si no creaste esta cuenta, ignora este correo.";
        var heading = isEn ? "Confirm your email" : "Confirma tu correo";
        var subhead = isEn
            ? $"Hi {nameEnc}, one step left to activate your account."
            : $"Hola {nameEnc}, falta un paso para activar tu cuenta.";
        var instructions = isEn
            ? $"Click the button to confirm that <strong>{emailEnc}</strong> is yours. The link is valid for 7 days."
            : $"Da clic en el botón para confirmar que <strong>{emailEnc}</strong> es tuyo. El enlace es válido por 7 días.";
        var buttonLabel = isEn ? "Confirm email" : "Confirmar correo";
        var fallback = isEn
            ? "If the button doesn't work, copy this link into your browser:"
            : "Si el botón no funciona, copia este enlace en tu navegador:";
        var htmlLang = isEn ? "en" : "es";

        var text = $@"{greeting}

{intro}

{verifyLink}

{ignore}

— Baja Tours";

        var html = $@"
<!doctype html>
<html lang=""{htmlLang}"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">{heading}</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">{subhead}</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <p style=""margin:0 0 20px 0;color:#0f172a;font-size:14px;line-height:1.6;"">
        {instructions}
      </p>
      <a href=""{verifyLink}"" style=""display:inline-block;background:#0ea5b7;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:9999px;font-size:14px;"">{buttonLabel}</a>
      <p style=""margin:24px 0 0 0;color:#94a3b8;font-size:12px;line-height:1.6;"">
        {fallback}<br>
        <span style=""color:#0ea5b7;word-break:break-all;"">{verifyLink}</span>
      </p>
    </td></tr>
    <tr><td style=""padding:16px 28px 28px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;"">
      {ignore}
    </td></tr>
  </table>
</body></html>";

        return new EmailMessage(
            To: new EmailRecipient(user.Email, user.FullName),
            Subject: subject,
            HtmlBody: html,
            TextBody: text);
    }

    public static EmailMessage PasswordReset(User user, string resetLink, string? language = null)
    {
        var (_, isEn) = EmailLocale.Resolve(language ?? user.PreferredLanguage);
        var name = string.IsNullOrWhiteSpace(user.FullName) ? "" : user.FullName;
        var nameEnc = WebUtility.HtmlEncode(name);
        var emailEnc = WebUtility.HtmlEncode(user.Email);

        var subject = isEn ? "Reset your password — Baja Tours" : "Restablece tu contraseña — Baja Tours";
        var greeting = isEn ? $"Hi {name}," : $"Hola {name},";
        var intro = isEn
            ? "We received a request to reset your password. If it was you, open the link below (valid for 1 hour):"
            : "Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, abre el siguiente enlace (válido por 1 hora):";
        var ignore = isEn
            ? "If you didn't request this change, ignore this email and your password will stay the same."
            : "Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá igual.";
        var ignoreShort = isEn
            ? "If you didn't request this change, ignore this email. Your password will stay the same."
            : "Si no solicitaste este cambio, ignora este correo. Tu contraseña permanecerá igual.";
        var heading = isEn ? "Reset your password" : "Restablece tu contraseña";
        var subhead = isEn
            ? $"Hi {nameEnc}, we'll help you get back in."
            : $"Hola {nameEnc}, te ayudamos a recuperar el acceso.";
        var instructions = isEn
            ? $"We received a request to reset the password for <strong>{emailEnc}</strong>. The link is valid for 1 hour."
            : $"Recibimos una solicitud para restablecer la contraseña de <strong>{emailEnc}</strong>. El enlace es válido por 1 hora.";
        var buttonLabel = isEn ? "Reset password" : "Restablecer contraseña";
        var fallback = isEn
            ? "If the button doesn't work, copy this link into your browser:"
            : "Si el botón no funciona, copia este enlace en tu navegador:";
        var htmlLang = isEn ? "en" : "es";

        var text = $@"{greeting}

{intro}

{resetLink}

{ignore}

— Baja Tours";

        var html = $@"
<!doctype html>
<html lang=""{htmlLang}"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">{heading}</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">{subhead}</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <p style=""margin:0 0 20px 0;color:#0f172a;font-size:14px;line-height:1.6;"">
        {instructions}
      </p>
      <a href=""{resetLink}"" style=""display:inline-block;background:#0ea5b7;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:9999px;font-size:14px;"">{buttonLabel}</a>
      <p style=""margin:24px 0 0 0;color:#94a3b8;font-size:12px;line-height:1.6;"">
        {fallback}<br>
        <span style=""color:#0ea5b7;word-break:break-all;"">{resetLink}</span>
      </p>
    </td></tr>
    <tr><td style=""padding:16px 28px 28px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;"">
      {ignoreShort}
    </td></tr>
  </table>
</body></html>";

        return new EmailMessage(
            To: new EmailRecipient(user.Email, user.FullName),
            Subject: subject,
            HtmlBody: html,
            TextBody: text);
    }
}

public static class EmailTemplates
{
    public static EmailMessage BookingConfirmedToCustomer(
        Booking booking, Tour tour, Provider provider, string frontendUrl, string? language = null)
    {
        var (culture, isEn) = EmailLocale.Resolve(language ?? booking.Language);
        var bookingUrl = $"{frontendUrl.TrimEnd('/')}/perfil/reservas/{booking.Id}";
        var dateLabel = booking.Date.ToString("yyyy-MM-dd");
        var time = booking.StartTime?.ToString("HH:mm") ?? "—";
        var guestsCount = booking.Adults + booking.Children;
        var guestsLabel = isEn
            ? (guestsCount == 1 ? "guest" : "guests")
            : (guestsCount == 1 ? "huésped" : "huéspedes");
        var totalLabel = booking.TotalPrice.ToString("C0", culture);
        var meetingPoint = tour.MeetingPoint ?? "—";

        var subject = isEn
            ? $"Booking confirmed — {tour.Title}"
            : $"Reserva confirmada — {tour.Title}";

        string text;
        if (isEn)
        {
            text = $@"Hi {booking.ContactName},

Your booking with {provider.CompanyName} is confirmed.

Tour: {tour.Title}
Date: {dateLabel} {time}
{guestsCount} {guestsLabel}
Meeting point: {meetingPoint}
Total paid: {totalLabel} {booking.Currency}
Reference: {booking.Reference}

Booking details: {bookingUrl}

Have a great trip!
Baja Tours";
        }
        else
        {
            text = $@"Hola {booking.ContactName},

Tu reserva con {provider.CompanyName} fue confirmada.

Tour: {tour.Title}
Fecha: {dateLabel} {time}
{guestsCount} {guestsLabel}
Punto de encuentro: {meetingPoint}
Total pagado: {totalLabel} {booking.Currency}
Referencia: {booking.Reference}

Detalles de la reserva: {bookingUrl}

¡Buen viaje!
Baja Tours";
        }

        var heading = isEn ? "Booking confirmed!" : "¡Reserva confirmada!";
        var subhead = isEn
            ? $"Hi {WebUtility.HtmlEncode(booking.ContactName)}, your booking with <strong>{WebUtility.HtmlEncode(provider.CompanyName)}</strong> is set."
            : $"Hola {WebUtility.HtmlEncode(booking.ContactName)}, tu reserva con <strong>{WebUtility.HtmlEncode(provider.CompanyName)}</strong> está lista.";
        var dateLbl = isEn ? "Date:" : "Fecha:";
        var guestsLbl = isEn ? "Guests:" : "Huéspedes:";
        var meetLbl = isEn ? "Meeting point:" : "Punto de encuentro:";
        var totalLbl = isEn ? "Total paid:" : "Total pagado:";
        var refLbl = isEn ? "Reference:" : "Referencia:";
        var btn = isEn ? "View booking details" : "Ver detalles de la reserva";
        var footer = isEn
            ? "Baja Tours · If you have questions, reply to this email."
            : "Baja Tours · Si tienes preguntas, responde a este correo.";
        var htmlLang = isEn ? "en" : "es";

        var html = $@"
<!doctype html>
<html lang=""{htmlLang}"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">{heading}</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">{subhead}</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <h2 style=""margin:0 0 12px 0;font-size:16px;color:#0f172a;"">{WebUtility.HtmlEncode(tour.Title)}</h2>
      <p style=""margin:0;color:#64748b;font-size:14px;line-height:1.6;"">
        <strong>{dateLbl}</strong> {dateLabel} {time}<br>
        <strong>{guestsLbl}</strong> {guestsCount}<br>
        <strong>{meetLbl}</strong> {WebUtility.HtmlEncode(meetingPoint)}<br>
        <strong>{totalLbl}</strong> {totalLabel} {booking.Currency}<br>
        <strong>{refLbl}</strong> <code>{booking.Reference}</code>
      </p>
    </td></tr>
    <tr><td style=""padding:0 28px 28px 28px;"">
      <a href=""{bookingUrl}"" style=""display:inline-block;background:#0ea5b7;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:9999px;font-size:14px;"">{btn}</a>
    </td></tr>
    <tr><td style=""padding:16px 28px 28px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;"">
      {footer}
    </td></tr>
  </table>
</body></html>";

        return new EmailMessage(
            To: new EmailRecipient(booking.ContactEmail, booking.ContactName),
            Subject: subject,
            HtmlBody: html,
            TextBody: text);
    }

    public static EmailMessage BookingConfirmedToProvider(
        Booking booking, Tour tour, Provider provider, User providerUser, string frontendUrl, string? language = null)
    {
        var (culture, isEn) = EmailLocale.Resolve(language ?? providerUser.PreferredLanguage);
        var providerUrl = $"{frontendUrl.TrimEnd('/')}/proveedor/reservas";
        var net = (booking.TotalPrice - booking.CommissionAmount).ToString("C0", culture);
        var commission = booking.CommissionAmount.ToString("C0", culture);
        var totalPaid = booking.TotalPrice.ToString("C0", culture);
        var datePart = $"{booking.Date:yyyy-MM-dd} {booking.StartTime?.ToString("HH:mm") ?? ""}";
        var contactLine = $"{booking.ContactName} ({booking.ContactEmail}" +
                          (booking.ContactPhone != null ? $", {booking.ContactPhone}" : "") + ")";

        var subject = isEn
            ? $"New booking — {tour.Title} ({booking.Date:yyyy-MM-dd})"
            : $"Nueva reserva — {tour.Title} ({booking.Date:yyyy-MM-dd})";

        string text;
        if (isEn)
        {
            text = $@"Hi {provider.CompanyName},

You have a new confirmed booking.

Tour: {tour.Title}
Customer: {contactLine}
Date: {datePart}
{booking.Adults} adult(s), {booking.Children} child(ren)
Total paid: {totalPaid} {booking.Currency}
Baja Tours commission: {commission}
Your net: {net}
Reference: {booking.Reference}

View in dashboard: {providerUrl}";
        }
        else
        {
            text = $@"Hola {provider.CompanyName},

Tienes una nueva reserva confirmada.

Tour: {tour.Title}
Cliente: {contactLine}
Fecha: {datePart}
{booking.Adults} adulto(s), {booking.Children} niño(s)
Total pagado: {totalPaid} {booking.Currency}
Comisión Baja Tours: {commission}
Tu neto: {net}
Referencia: {booking.Reference}

Ver en panel: {providerUrl}";
        }

        var heading = isEn ? "New confirmed booking" : "Nueva reserva confirmada";
        var subhead = isEn
            ? $"A booking just came in for <strong>{WebUtility.HtmlEncode(tour.Title)}</strong>."
            : $"Llegó una reserva para <strong>{WebUtility.HtmlEncode(tour.Title)}</strong>.";
        var customerLbl = isEn ? "Customer" : "Cliente";
        var detailsLbl = isEn ? "Details" : "Detalles";
        var dateLbl = isEn ? "Date:" : "Fecha:";
        var guestsLbl = isEn
            ? $"<strong>Guests:</strong> {booking.Adults} adult(s), {booking.Children} child(ren)"
            : $"<strong>Huéspedes:</strong> {booking.Adults} adulto(s), {booking.Children} niño(s)";
        var totalLbl = isEn ? "Total paid:" : "Total pagado:";
        var commissionLbl = isEn ? "Baja Tours commission:" : "Comisión Baja Tours:";
        var netLbl = isEn ? "Your net:" : "Tu neto:";
        var refLbl = isEn ? "Reference:" : "Referencia:";
        var btn = isEn ? "View in dashboard" : "Ver en panel";
        var htmlLang = isEn ? "en" : "es";

        var html = $@"
<!doctype html>
<html lang=""{htmlLang}"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">{heading}</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">{subhead}</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <h3 style=""margin:0 0 8px 0;font-size:14px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;"">{customerLbl}</h3>
      <p style=""margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#0f172a;"">
        {WebUtility.HtmlEncode(booking.ContactName)}<br>
        <a href=""mailto:{booking.ContactEmail}"" style=""color:#0ea5b7;"">{booking.ContactEmail}</a>{(booking.ContactPhone != null ? $"<br>{WebUtility.HtmlEncode(booking.ContactPhone)}" : "")}
      </p>
      <h3 style=""margin:0 0 8px 0;font-size:14px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;"">{detailsLbl}</h3>
      <p style=""margin:0;color:#0f172a;font-size:14px;line-height:1.6;"">
        <strong>{dateLbl}</strong> {datePart}<br>
        {guestsLbl}<br>
        <strong>{totalLbl}</strong> {totalPaid} {booking.Currency}<br>
        <strong>{commissionLbl}</strong> {commission}<br>
        <strong style=""color:#0ea5b7;"">{netLbl} {net}</strong><br>
        <strong>{refLbl}</strong> <code>{booking.Reference}</code>
      </p>
    </td></tr>
    <tr><td style=""padding:0 28px 28px 28px;"">
      <a href=""{providerUrl}"" style=""display:inline-block;background:#0ea5b7;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:9999px;font-size:14px;"">{btn}</a>
    </td></tr>
  </table>
</body></html>";

        return new EmailMessage(
            To: new EmailRecipient(providerUser.Email, provider.CompanyName),
            Subject: subject,
            HtmlBody: html,
            TextBody: text,
            ReplyTo: booking.ContactEmail);
    }

    public static EmailMessage BookingCancelledToCustomer(
        Booking booking, Tour tour, Provider provider, bool refunded, string? language = null)
    {
        var (culture, isEn) = EmailLocale.Resolve(language ?? booking.Language);
        var totalLabel = booking.TotalPrice.ToString("C0", culture);

        var subject = isEn
            ? $"Booking cancelled — {tour.Title}"
            : $"Reserva cancelada — {tour.Title}";

        string refundLine;
        if (isEn)
        {
            refundLine = refunded
                ? $"We refunded {totalLabel} {booking.Currency} to your original payment method. It can take 3-10 business days to appear."
                : "No charge was processed, so there is no pending refund.";
        }
        else
        {
            refundLine = refunded
                ? $"Te reembolsamos {totalLabel} {booking.Currency} a tu método de pago original. Puede tardar 3-10 días hábiles en reflejarse."
                : "No se procesó ningún cargo, así que no hay reembolso pendiente.";
        }

        string text;
        if (isEn)
        {
            text = $@"Hi {booking.ContactName},

Your booking with {provider.CompanyName} has been cancelled.

Tour: {tour.Title}
Original date: {booking.Date:yyyy-MM-dd}
Reference: {booking.Reference}

{refundLine}

If you have questions about the cancellation, reply to this email.

Baja Tours";
        }
        else
        {
            text = $@"Hola {booking.ContactName},

Tu reserva con {provider.CompanyName} fue cancelada.

Tour: {tour.Title}
Fecha original: {booking.Date:yyyy-MM-dd}
Referencia: {booking.Reference}

{refundLine}

Si tienes preguntas sobre la cancelación, responde a este correo.

Baja Tours";
        }

        var heading = isEn ? "Booking cancelled" : "Reserva cancelada";
        var subhead = isEn
            ? $"Hi {WebUtility.HtmlEncode(booking.ContactName)}, your booking with <strong>{WebUtility.HtmlEncode(provider.CompanyName)}</strong> has been cancelled."
            : $"Hola {WebUtility.HtmlEncode(booking.ContactName)}, tu reserva con <strong>{WebUtility.HtmlEncode(provider.CompanyName)}</strong> fue cancelada.";
        var tourLbl = isEn ? "Tour:" : "Tour:";
        var dateLbl = isEn ? "Original date:" : "Fecha original:";
        var refLbl = isEn ? "Reference:" : "Referencia:";
        var footer = isEn
            ? "Baja Tours · If you have questions, reply to this email."
            : "Baja Tours · Si tienes preguntas, responde a este correo.";
        var htmlLang = isEn ? "en" : "es";

        var html = $@"
<!doctype html>
<html lang=""{htmlLang}"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">{heading}</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">{subhead}</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <p style=""margin:0 0 16px 0;color:#0f172a;font-size:14px;line-height:1.6;"">
        <strong>{tourLbl}</strong> {WebUtility.HtmlEncode(tour.Title)}<br>
        <strong>{dateLbl}</strong> {booking.Date:yyyy-MM-dd}<br>
        <strong>{refLbl}</strong> <code>{booking.Reference}</code>
      </p>
      <p style=""margin:0;color:#0f172a;font-size:14px;line-height:1.6;"">{WebUtility.HtmlEncode(refundLine)}</p>
    </td></tr>
    <tr><td style=""padding:16px 28px 28px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;"">
      {footer}
    </td></tr>
  </table>
</body></html>";

        return new EmailMessage(
            To: new EmailRecipient(booking.ContactEmail, booking.ContactName),
            Subject: subject,
            HtmlBody: html,
            TextBody: text);
    }

    public static EmailMessage BookingCancelledToProvider(
        Booking booking, Tour tour, Provider provider, User providerUser, bool refunded, string? language = null)
    {
        var (culture, isEn) = EmailLocale.Resolve(language ?? providerUser.PreferredLanguage);
        var totalLabel = booking.TotalPrice.ToString("C0", culture);

        var subject = isEn
            ? $"Booking cancelled — {tour.Title} ({booking.Date:yyyy-MM-dd})"
            : $"Reserva cancelada — {tour.Title} ({booking.Date:yyyy-MM-dd})";

        string refundLine;
        if (isEn)
        {
            refundLine = refunded
                ? $"The customer received a full refund of {totalLabel} {booking.Currency}."
                : "The payment was still pending, no charge to refund.";
        }
        else
        {
            refundLine = refunded
                ? $"El cliente recibió un reembolso completo de {totalLabel} {booking.Currency}."
                : "El pago aún estaba pendiente, no hubo cargo que reembolsar.";
        }

        var reasonText = booking.CancelReason ?? "—";
        var commentLine = string.IsNullOrWhiteSpace(booking.CancelComment) ? "" :
            (isEn
                ? $"Customer comment: {booking.CancelComment}\n"
                : $"Comentario del cliente: {booking.CancelComment}\n");

        string text;
        if (isEn)
        {
            text = $@"Hi {provider.CompanyName},

A confirmed booking has been cancelled.

Tour: {tour.Title}
Customer: {booking.ContactName} ({booking.ContactEmail})
Original date: {booking.Date:yyyy-MM-dd}
Reference: {booking.Reference}
Reason: {reasonText}
{commentLine}{refundLine}

— Baja Tours";
        }
        else
        {
            text = $@"Hola {provider.CompanyName},

Una reserva confirmada fue cancelada.

Tour: {tour.Title}
Cliente: {booking.ContactName} ({booking.ContactEmail})
Fecha original: {booking.Date:yyyy-MM-dd}
Referencia: {booking.Reference}
Motivo: {reasonText}
{commentLine}{refundLine}

— Baja Tours";
        }

        var heading = isEn ? "Booking cancelled" : "Reserva cancelada";
        var subhead = isEn
            ? $"A booking for <strong>{WebUtility.HtmlEncode(tour.Title)}</strong> was cancelled."
            : $"Una reserva de <strong>{WebUtility.HtmlEncode(tour.Title)}</strong> fue cancelada.";
        var customerLbl = isEn ? "Customer:" : "Cliente:";
        var dateLbl = isEn ? "Original date:" : "Fecha original:";
        var refLbl = isEn ? "Reference:" : "Referencia:";
        var reasonLbl = isEn ? "Reason:" : "Motivo:";
        var commentLbl = isEn ? "Comment:" : "Comentario:";
        var htmlLang = isEn ? "en" : "es";

        var html = $@"
<!doctype html>
<html lang=""{htmlLang}"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">{heading}</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">{subhead}</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <p style=""margin:0;color:#0f172a;font-size:14px;line-height:1.6;"">
        <strong>{customerLbl}</strong> {WebUtility.HtmlEncode(booking.ContactName)} ({booking.ContactEmail})<br>
        <strong>{dateLbl}</strong> {booking.Date:yyyy-MM-dd}<br>
        <strong>{refLbl}</strong> <code>{booking.Reference}</code><br>
        <strong>{reasonLbl}</strong> {WebUtility.HtmlEncode(reasonText)}<br>
        {(string.IsNullOrWhiteSpace(booking.CancelComment) ? "" : $"<strong>{commentLbl}</strong> {WebUtility.HtmlEncode(booking.CancelComment)}<br>")}
      </p>
      <p style=""margin:16px 0 0 0;color:#64748b;font-size:13px;"">{WebUtility.HtmlEncode(refundLine)}</p>
    </td></tr>
  </table>
</body></html>";

        return new EmailMessage(
            To: new EmailRecipient(providerUser.Email, provider.CompanyName),
            Subject: subject,
            HtmlBody: html,
            TextBody: text);
    }
}

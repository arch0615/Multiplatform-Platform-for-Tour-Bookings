using System.Globalization;
using System.Net;
using BajaTours.Api.Domain.Entities;

namespace BajaTours.Api.Services.Notifications;

public static class EmailFlowTemplates
{
    public static EmailMessage EmailVerify(User user, string verifyLink)
    {
        var subject = "Confirma tu correo — Baja Tours";
        var name = string.IsNullOrWhiteSpace(user.FullName) ? "" : user.FullName;
        var text = $@"Hola {name},

Gracias por crear tu cuenta en Baja Tours. Para activarla, confirma tu correo dando clic en este enlace (válido por 7 días):

{verifyLink}

Si no creaste esta cuenta, ignora este correo.

— Baja Tours";

        var html = $@"
<!doctype html>
<html lang=""es"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">Confirma tu correo</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">Hola {WebUtility.HtmlEncode(name)}, falta un paso para activar tu cuenta.</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <p style=""margin:0 0 20px 0;color:#0f172a;font-size:14px;line-height:1.6;"">
        Da clic en el botón para confirmar que <strong>{WebUtility.HtmlEncode(user.Email)}</strong> es tuyo. El enlace es válido por 7 días.
      </p>
      <a href=""{verifyLink}"" style=""display:inline-block;background:#0ea5b7;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:9999px;font-size:14px;"">Confirmar correo</a>
      <p style=""margin:24px 0 0 0;color:#94a3b8;font-size:12px;line-height:1.6;"">
        Si el botón no funciona, copia este enlace en tu navegador:<br>
        <span style=""color:#0ea5b7;word-break:break-all;"">{verifyLink}</span>
      </p>
    </td></tr>
    <tr><td style=""padding:16px 28px 28px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;"">
      Si no creaste esta cuenta, ignora este correo.
    </td></tr>
  </table>
</body></html>";

        return new EmailMessage(
            To: new EmailRecipient(user.Email, user.FullName),
            Subject: subject,
            HtmlBody: html,
            TextBody: text);
    }

    public static EmailMessage PasswordReset(User user, string resetLink)
    {
        var subject = "Restablece tu contraseña — Baja Tours";
        var name = string.IsNullOrWhiteSpace(user.FullName) ? "" : user.FullName;
        var text = $@"Hola {name},

Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, abre el siguiente enlace (válido por 1 hora):

{resetLink}

Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá igual.

— Baja Tours";

        var html = $@"
<!doctype html>
<html lang=""es"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">Restablece tu contraseña</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">Hola {WebUtility.HtmlEncode(name)}, te ayudamos a recuperar el acceso.</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <p style=""margin:0 0 20px 0;color:#0f172a;font-size:14px;line-height:1.6;"">
        Recibimos una solicitud para restablecer la contraseña de <strong>{WebUtility.HtmlEncode(user.Email)}</strong>. El enlace es válido por 1 hora.
      </p>
      <a href=""{resetLink}"" style=""display:inline-block;background:#0ea5b7;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:9999px;font-size:14px;"">Restablecer contraseña</a>
      <p style=""margin:24px 0 0 0;color:#94a3b8;font-size:12px;line-height:1.6;"">
        Si el botón no funciona, copia este enlace en tu navegador:<br>
        <span style=""color:#0ea5b7;word-break:break-all;"">{resetLink}</span>
      </p>
    </td></tr>
    <tr><td style=""padding:16px 28px 28px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;"">
      Si no solicitaste este cambio, ignora este correo. Tu contraseña permanecerá igual.
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
    private static readonly CultureInfo Mxn = CultureInfo.GetCultureInfo("es-MX");

    public static EmailMessage BookingConfirmedToCustomer(Booking booking, Tour tour, Provider provider, string frontendUrl)
    {
        var subject = $"Reserva confirmada — {tour.Title}";
        var bookingUrl = $"{frontendUrl.TrimEnd('/')}/perfil/reservas/{booking.Id}";
        var dateLabel = booking.Date.ToString("yyyy-MM-dd");
        var time = booking.StartTime?.ToString("HH:mm") ?? "—";
        var guestsLabel = (booking.Adults + booking.Children) == 1 ? "huésped" : "huéspedes";
        var totalLabel = booking.TotalPrice.ToString("C0", Mxn);

        var text = $@"Hola {booking.ContactName},

Tu reserva con {provider.CompanyName} fue confirmada.

Tour: {tour.Title}
Fecha: {dateLabel} {time}
{booking.Adults + booking.Children} {guestsLabel}
Punto de encuentro: {tour.MeetingPoint ?? "—"}
Total pagado: {totalLabel} {booking.Currency}
Referencia: {booking.Reference}

Detalles de la reserva: {bookingUrl}

¡Buen viaje!
Baja Tours";

        var html = $@"
<!doctype html>
<html lang=""es"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">¡Reserva confirmada!</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">Hola {WebUtility.HtmlEncode(booking.ContactName)}, tu reserva con <strong>{WebUtility.HtmlEncode(provider.CompanyName)}</strong> está lista.</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <h2 style=""margin:0 0 12px 0;font-size:16px;color:#0f172a;"">{WebUtility.HtmlEncode(tour.Title)}</h2>
      <p style=""margin:0;color:#64748b;font-size:14px;line-height:1.6;"">
        <strong>Fecha:</strong> {dateLabel} {time}<br>
        <strong>Huéspedes:</strong> {booking.Adults + booking.Children}<br>
        <strong>Punto de encuentro:</strong> {WebUtility.HtmlEncode(tour.MeetingPoint ?? "—")}<br>
        <strong>Total pagado:</strong> {totalLabel} {booking.Currency}<br>
        <strong>Referencia:</strong> <code>{booking.Reference}</code>
      </p>
    </td></tr>
    <tr><td style=""padding:0 28px 28px 28px;"">
      <a href=""{bookingUrl}"" style=""display:inline-block;background:#0ea5b7;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:9999px;font-size:14px;"">Ver detalles de la reserva</a>
    </td></tr>
    <tr><td style=""padding:16px 28px 28px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;"">
      Baja Tours · Si tienes preguntas, responde a este correo.
    </td></tr>
  </table>
</body></html>";

        return new EmailMessage(
            To: new EmailRecipient(booking.ContactEmail, booking.ContactName),
            Subject: subject,
            HtmlBody: html,
            TextBody: text);
    }

    public static EmailMessage BookingConfirmedToProvider(Booking booking, Tour tour, Provider provider, User providerUser, string frontendUrl)
    {
        var subject = $"Nueva reserva — {tour.Title} ({booking.Date:yyyy-MM-dd})";
        var providerUrl = $"{frontendUrl.TrimEnd('/')}/proveedor/reservas";
        var net = (booking.TotalPrice - booking.CommissionAmount).ToString("C0", Mxn);
        var commission = booking.CommissionAmount.ToString("C0", Mxn);

        var text = $@"Hola {provider.CompanyName},

Tienes una nueva reserva confirmada.

Tour: {tour.Title}
Cliente: {booking.ContactName} ({booking.ContactEmail}{(booking.ContactPhone != null ? $", {booking.ContactPhone}" : "")})
Fecha: {booking.Date:yyyy-MM-dd} {booking.StartTime?.ToString("HH:mm") ?? ""}
{booking.Adults} adulto(s), {booking.Children} niño(s)
Total pagado: {booking.TotalPrice.ToString("C0", Mxn)} {booking.Currency}
Comisión Baja Tours: {commission}
Tu neto: {net}
Referencia: {booking.Reference}

Ver en panel: {providerUrl}";

        var html = $@"
<!doctype html>
<html lang=""es"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">Nueva reserva confirmada</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">Llegó una reserva para <strong>{WebUtility.HtmlEncode(tour.Title)}</strong>.</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <h3 style=""margin:0 0 8px 0;font-size:14px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;"">Cliente</h3>
      <p style=""margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#0f172a;"">
        {WebUtility.HtmlEncode(booking.ContactName)}<br>
        <a href=""mailto:{booking.ContactEmail}"" style=""color:#0ea5b7;"">{booking.ContactEmail}</a>{(booking.ContactPhone != null ? $"<br>{WebUtility.HtmlEncode(booking.ContactPhone)}" : "")}
      </p>
      <h3 style=""margin:0 0 8px 0;font-size:14px;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;"">Detalles</h3>
      <p style=""margin:0;color:#0f172a;font-size:14px;line-height:1.6;"">
        <strong>Fecha:</strong> {booking.Date:yyyy-MM-dd} {booking.StartTime?.ToString("HH:mm") ?? ""}<br>
        <strong>Huéspedes:</strong> {booking.Adults} adulto(s), {booking.Children} niño(s)<br>
        <strong>Total pagado:</strong> {booking.TotalPrice.ToString("C0", Mxn)} {booking.Currency}<br>
        <strong>Comisión Baja Tours:</strong> {commission}<br>
        <strong style=""color:#0ea5b7;"">Tu neto: {net}</strong><br>
        <strong>Referencia:</strong> <code>{booking.Reference}</code>
      </p>
    </td></tr>
    <tr><td style=""padding:0 28px 28px 28px;"">
      <a href=""{providerUrl}"" style=""display:inline-block;background:#0ea5b7;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:9999px;font-size:14px;"">Ver en panel</a>
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

    public static EmailMessage BookingCancelledToCustomer(Booking booking, Tour tour, Provider provider, bool refunded)
    {
        var subject = $"Reserva cancelada — {tour.Title}";
        var refundLine = refunded
            ? $"Te reembolsamos {booking.TotalPrice.ToString("C0", Mxn)} {booking.Currency} a tu método de pago original. Puede tardar 3-10 días hábiles en reflejarse."
            : "No se procesó ningún cargo, así que no hay reembolso pendiente.";

        var text = $@"Hola {booking.ContactName},

Tu reserva con {provider.CompanyName} fue cancelada.

Tour: {tour.Title}
Fecha original: {booking.Date:yyyy-MM-dd}
Referencia: {booking.Reference}

{refundLine}

Si tienes preguntas sobre la cancelación, responde a este correo.

Baja Tours";

        var html = $@"
<!doctype html>
<html lang=""es"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">Reserva cancelada</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">Hola {WebUtility.HtmlEncode(booking.ContactName)}, tu reserva con <strong>{WebUtility.HtmlEncode(provider.CompanyName)}</strong> fue cancelada.</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <p style=""margin:0 0 16px 0;color:#0f172a;font-size:14px;line-height:1.6;"">
        <strong>Tour:</strong> {WebUtility.HtmlEncode(tour.Title)}<br>
        <strong>Fecha original:</strong> {booking.Date:yyyy-MM-dd}<br>
        <strong>Referencia:</strong> <code>{booking.Reference}</code>
      </p>
      <p style=""margin:0;color:#0f172a;font-size:14px;line-height:1.6;"">{WebUtility.HtmlEncode(refundLine)}</p>
    </td></tr>
    <tr><td style=""padding:16px 28px 28px 28px;color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;"">
      Baja Tours · Si tienes preguntas, responde a este correo.
    </td></tr>
  </table>
</body></html>";

        return new EmailMessage(
            To: new EmailRecipient(booking.ContactEmail, booking.ContactName),
            Subject: subject,
            HtmlBody: html,
            TextBody: text);
    }

    public static EmailMessage BookingCancelledToProvider(Booking booking, Tour tour, Provider provider, User providerUser, bool refunded)
    {
        var subject = $"Reserva cancelada — {tour.Title} ({booking.Date:yyyy-MM-dd})";
        var refundLine = refunded
            ? $"El cliente recibió un reembolso completo de {booking.TotalPrice.ToString("C0", Mxn)} {booking.Currency}."
            : "El pago aún estaba pendiente, no hubo cargo que reembolsar.";

        var text = $@"Hola {provider.CompanyName},

Una reserva confirmada fue cancelada.

Tour: {tour.Title}
Cliente: {booking.ContactName} ({booking.ContactEmail})
Fecha original: {booking.Date:yyyy-MM-dd}
Referencia: {booking.Reference}
Motivo: {booking.CancelReason ?? "—"}
{(string.IsNullOrWhiteSpace(booking.CancelComment) ? "" : $"Comentario del cliente: {booking.CancelComment}\n")}
{refundLine}

— Baja Tours";

        var html = $@"
<!doctype html>
<html lang=""es"">
<body style=""font-family:system-ui,Segoe UI,sans-serif;color:#0f172a;background:#f8fafc;padding:24px;"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:600px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;"">
    <tr><td style=""padding:24px 28px;border-bottom:1px solid #f1f5f9;"">
      <h1 style=""margin:0 0 4px 0;font-size:22px;color:#0f172a;"">Reserva cancelada</h1>
      <p style=""margin:0;color:#64748b;font-size:14px;"">Una reserva de <strong>{WebUtility.HtmlEncode(tour.Title)}</strong> fue cancelada.</p>
    </td></tr>
    <tr><td style=""padding:24px 28px;"">
      <p style=""margin:0;color:#0f172a;font-size:14px;line-height:1.6;"">
        <strong>Cliente:</strong> {WebUtility.HtmlEncode(booking.ContactName)} ({booking.ContactEmail})<br>
        <strong>Fecha original:</strong> {booking.Date:yyyy-MM-dd}<br>
        <strong>Referencia:</strong> <code>{booking.Reference}</code><br>
        <strong>Motivo:</strong> {WebUtility.HtmlEncode(booking.CancelReason ?? "—")}<br>
        {(string.IsNullOrWhiteSpace(booking.CancelComment) ? "" : $"<strong>Comentario:</strong> {WebUtility.HtmlEncode(booking.CancelComment)}<br>")}
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

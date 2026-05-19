using System.Text.Json;
using BajaTours.Api.Configuration;
using BajaTours.Api.Domain.Enums;
using BajaTours.Api.Services.Bookings;
using BajaTours.Api.Services.Payments;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BajaTours.Api.Controllers;

[ApiController]
[Route("api/payments/mercadopago")]
public class PaymentsController : ControllerBase
{
    private readonly IBookingService _bookings;
    private readonly IMercadoPagoService _mp;
    private readonly PaymentsOptions _options;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(
        IBookingService bookings,
        IMercadoPagoService mp,
        IOptions<PaymentsOptions> options,
        ILogger<PaymentsController> logger)
    {
        _bookings = bookings;
        _mp = mp;
        _options = options.Value;
        _logger = logger;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook([FromQuery(Name = "type")] string? type,
                                              [FromQuery(Name = "data.id")] string? dataIdQuery,
                                              CancellationToken ct)
    {
        using var reader = new StreamReader(Request.Body);
        var rawBody = await reader.ReadToEndAsync(ct);
        _logger.LogInformation("MP webhook received: type={Type} body={Body}", type, rawBody);

        string? paymentId = dataIdQuery;
        string? action = type;

        if (!string.IsNullOrWhiteSpace(rawBody))
        {
            try
            {
                using var doc = JsonDocument.Parse(rawBody);
                if (doc.RootElement.TryGetProperty("data", out var dataNode)
                    && dataNode.TryGetProperty("id", out var idNode))
                {
                    paymentId = idNode.ValueKind == JsonValueKind.String ? idNode.GetString() : idNode.GetRawText();
                }
                if (doc.RootElement.TryGetProperty("action", out var actionNode))
                    action = actionNode.GetString() ?? action;
            }
            catch (JsonException)
            {
                // body may be empty for some notification types; query params still carry the IDs
            }
        }

        if (string.IsNullOrWhiteSpace(paymentId)) return Ok();

        // Signature verification (only when a secret is configured)
        var signatureHeader = Request.Headers["x-signature"].FirstOrDefault();
        var requestId = Request.Headers["x-request-id"].FirstOrDefault();
        var sigResult = MercadoPagoWebhookValidator.Validate(
            _options.MercadoPago.WebhookSecret, signatureHeader, requestId, paymentId);

        switch (sigResult)
        {
            case MercadoPagoWebhookValidator.Result.NoSecretConfigured:
                _logger.LogWarning("MP webhook accepted without signature verification: WebhookSecret not configured.");
                break;
            case MercadoPagoWebhookValidator.Result.Valid:
                _logger.LogDebug("MP webhook signature verified for payment {PaymentId}", paymentId);
                break;
            case MercadoPagoWebhookValidator.Result.MissingHeader:
                _logger.LogWarning("MP webhook rejected: missing x-signature header (payment {PaymentId})", paymentId);
                return Unauthorized();
            case MercadoPagoWebhookValidator.Result.MalformedHeader:
                _logger.LogWarning("MP webhook rejected: malformed x-signature header (payment {PaymentId})", paymentId);
                return Unauthorized();
            case MercadoPagoWebhookValidator.Result.Invalid:
                _logger.LogWarning("MP webhook rejected: HMAC mismatch (payment {PaymentId}, request {RequestId})", paymentId, requestId);
                return Unauthorized();
        }

        if (!(action ?? string.Empty).StartsWith("payment", StringComparison.OrdinalIgnoreCase)
            && !string.Equals(type, "payment", StringComparison.OrdinalIgnoreCase))
        {
            return Ok();
        }

        var info = await _mp.GetPaymentAsync(paymentId, ct);
        if (!Guid.TryParse(info.ExternalReference, out var bookingId))
        {
            _logger.LogWarning("MP webhook payment {PaymentId} missing external_reference", paymentId);
            return Ok();
        }

        var updated = await _bookings.MarkPaymentResultAsync(bookingId, info, ct);
        if (updated is null)
            _logger.LogWarning("MP webhook references unknown booking {BookingId}", bookingId);

        return Ok();
    }

    // Mock checkout endpoint used by MockMercadoPagoService.
    // Approves the booking immediately and redirects to the success page.
    [HttpGet("mock-checkout/{bookingId:guid}")]
    public async Task<IActionResult> MockCheckout(Guid bookingId, [FromQuery] string outcome = "approved", CancellationToken ct = default)
    {
        if (!string.Equals(_options.Mode, "Mock", StringComparison.OrdinalIgnoreCase))
            return NotFound();

        var status = outcome.ToLowerInvariant() switch
        {
            "rejected" => "rejected",
            "pending" => "pending",
            _ => "approved"
        };

        var raw = JsonSerializer.Serialize(new
        {
            id = $"MOCK-{Guid.NewGuid():N}",
            status,
            status_detail = status == "approved" ? "accredited" : status,
            external_reference = bookingId.ToString(),
            mock = true
        });
        var info = new MercadoPagoPaymentInfo(
            $"MOCK-{Guid.NewGuid():N}", status, status, 0m, "MXN", bookingId.ToString(), raw);

        await _bookings.MarkPaymentResultAsync(bookingId, info, ct);

        var frontend = _options.FrontendBaseUrl.TrimEnd('/');
        var redirect = status switch
        {
            "approved" => $"{frontend}/booking/success?bookingId={bookingId}&collection_status=approved",
            "rejected" => $"{frontend}/pago/fallido/{bookingId}",
            _ => $"{frontend}/pago/procesando?bookingId={bookingId}&collection_status=pending"
        };
        return Redirect(redirect);
    }
}

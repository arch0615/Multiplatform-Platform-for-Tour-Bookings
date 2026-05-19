using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using BajaTours.Api.Configuration;
using BajaTours.Api.Domain.Entities;
using Microsoft.Extensions.Options;

namespace BajaTours.Api.Services.Payments;

public class MercadoPagoService : IMercadoPagoService
{
    public const string HttpClientName = "mercadopago";

    private readonly HttpClient _http;
    private readonly PaymentsOptions _options;
    private readonly ILogger<MercadoPagoService> _logger;

    public MercadoPagoService(IHttpClientFactory factory, IOptions<PaymentsOptions> options, ILogger<MercadoPagoService> logger)
    {
        _options = options.Value;
        _logger = logger;
        _http = factory.CreateClient(HttpClientName);
        _http.BaseAddress = new Uri(_options.MercadoPago.ApiBaseUrl);
        _http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _options.MercadoPago.AccessToken);
    }

    public async Task<MercadoPagoPreference> CreatePreferenceAsync(Booking booking, Tour tour, CancellationToken ct)
    {
        var frontend = _options.FrontendBaseUrl.TrimEnd('/');
        var api = _options.ApiPublicBaseUrl.TrimEnd('/');

        var payload = new
        {
            external_reference = booking.Id.ToString(),
            items = new[]
            {
                new
                {
                    id = tour.Id.ToString(),
                    title = tour.Title,
                    description = $"{tour.Location} · {tour.Duration}",
                    quantity = 1,
                    currency_id = booking.Currency,
                    unit_price = (double)booking.TotalPrice
                }
            },
            payer = new
            {
                email = booking.ContactEmail,
                name = booking.ContactName
            },
            back_urls = new
            {
                success = $"{frontend}/booking/success?bookingId={booking.Id}",
                failure = $"{frontend}/pago/fallido/{booking.Id}",
                pending = $"{frontend}/pago/procesando?bookingId={booking.Id}"
            },
            auto_return = "approved",
            notification_url = $"{api}/api/payments/mercadopago/webhook",
            metadata = new { booking_id = booking.Id.ToString(), booking_reference = booking.Reference },
            statement_descriptor = "BAJA TOURS"
        };

        using var res = await _http.PostAsJsonAsync("/checkout/preferences", payload, ct);
        var body = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode)
        {
            _logger.LogError("MP preference creation failed: {Status} {Body}", res.StatusCode, body);
            throw new InvalidOperationException($"Mercado Pago preference creation failed ({(int)res.StatusCode}).");
        }

        using var doc = JsonDocument.Parse(body);
        var root = doc.RootElement;
        var preferenceId = root.GetProperty("id").GetString() ?? throw new InvalidOperationException("MP response missing id.");
        var initPoint = root.GetProperty("init_point").GetString() ?? throw new InvalidOperationException("MP response missing init_point.");
        var sandboxInitPoint = root.TryGetProperty("sandbox_init_point", out var s) ? s.GetString() ?? initPoint : initPoint;

        return new MercadoPagoPreference(preferenceId, initPoint, sandboxInitPoint);
    }

    public async Task<MercadoPagoRefundInfo> RefundPaymentAsync(string paymentId, decimal? amount, CancellationToken ct)
    {
        HttpResponseMessage res;
        if (amount is { } amt)
        {
            res = await _http.PostAsJsonAsync($"/v1/payments/{paymentId}/refunds", new { amount = (double)amt }, ct);
        }
        else
        {
            res = await _http.PostAsync($"/v1/payments/{paymentId}/refunds", content: null, ct);
        }

        try
        {
            var body = await res.Content.ReadAsStringAsync(ct);
            if (!res.IsSuccessStatusCode)
            {
                _logger.LogError("MP refund failed for payment {PaymentId}: {Status} {Body}", paymentId, res.StatusCode, body);
                throw new InvalidOperationException($"Mercado Pago refund failed ({(int)res.StatusCode}).");
            }

            using var doc = JsonDocument.Parse(body);
            var root = doc.RootElement;
            var refundId = root.TryGetProperty("id", out var idEl)
                ? (idEl.ValueKind == JsonValueKind.String ? idEl.GetString()! : idEl.GetRawText())
                : string.Empty;
            var pid = root.TryGetProperty("payment_id", out var pidEl)
                ? (pidEl.ValueKind == JsonValueKind.String ? pidEl.GetString()! : pidEl.GetRawText())
                : paymentId;
            var amt2 = root.TryGetProperty("amount", out var amtEl) && amtEl.ValueKind == JsonValueKind.Number
                ? amtEl.GetDecimal()
                : amount ?? 0m;
            var status = root.TryGetProperty("status", out var sEl) ? sEl.GetString() ?? "unknown" : "unknown";
            return new MercadoPagoRefundInfo(refundId, pid, amt2, status, body);
        }
        finally
        {
            res.Dispose();
        }
    }

    public async Task<MercadoPagoPaymentInfo> GetPaymentAsync(string paymentId, CancellationToken ct)
    {
        using var res = await _http.GetAsync($"/v1/payments/{paymentId}", ct);
        var body = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode)
        {
            _logger.LogError("MP payment fetch failed: {Status} {Body}", res.StatusCode, body);
            throw new InvalidOperationException($"Mercado Pago payment fetch failed ({(int)res.StatusCode}).");
        }

        using var doc = JsonDocument.Parse(body);
        var root = doc.RootElement;
        var status = root.GetProperty("status").GetString() ?? "unknown";
        var statusDetail = root.TryGetProperty("status_detail", out var sd) ? sd.GetString() : null;
        var amount = root.TryGetProperty("transaction_amount", out var a) ? a.GetDecimal() : 0m;
        var currency = root.TryGetProperty("currency_id", out var c) ? c.GetString() ?? "MXN" : "MXN";
        var externalRef = root.TryGetProperty("external_reference", out var er) ? er.GetString() : null;

        return new MercadoPagoPaymentInfo(paymentId, status, statusDetail, amount, currency, externalRef, body);
    }
}

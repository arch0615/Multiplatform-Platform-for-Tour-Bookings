using System.Text.Json;
using BajaTours.Api.Configuration;
using BajaTours.Api.Domain.Entities;
using Microsoft.Extensions.Options;

namespace BajaTours.Api.Services.Payments;

public class MockMercadoPagoService : IMercadoPagoService
{
    private readonly PaymentsOptions _options;

    public MockMercadoPagoService(IOptions<PaymentsOptions> options) => _options = options.Value;

    public Task<MercadoPagoPreference> CreatePreferenceAsync(Booking booking, Tour tour, CancellationToken ct)
    {
        var preferenceId = $"mock-pref-{booking.Id:N}";
        var initPoint = $"{_options.ApiPublicBaseUrl.TrimEnd('/')}/api/payments/mercadopago/mock-checkout/{booking.Id}";
        return Task.FromResult(new MercadoPagoPreference(preferenceId, initPoint, initPoint));
    }

    public Task<MercadoPagoPaymentInfo> GetPaymentAsync(string paymentId, CancellationToken ct)
    {
        var raw = JsonSerializer.Serialize(new
        {
            id = paymentId,
            status = "approved",
            status_detail = "accredited",
            mock = true
        });
        return Task.FromResult(new MercadoPagoPaymentInfo(
            paymentId, "approved", "accredited", 0m, "MXN", null, raw));
    }

    public Task<MercadoPagoRefundInfo> RefundPaymentAsync(string paymentId, decimal? amount, CancellationToken ct)
    {
        var refundId = $"mock-refund-{Guid.NewGuid():N}";
        var raw = JsonSerializer.Serialize(new
        {
            id = refundId,
            payment_id = paymentId,
            amount,
            status = "approved",
            mock = true
        });
        return Task.FromResult(new MercadoPagoRefundInfo(refundId, paymentId, amount ?? 0m, "approved", raw));
    }
}

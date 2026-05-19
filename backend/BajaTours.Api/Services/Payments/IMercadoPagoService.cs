using BajaTours.Api.Domain.Entities;

namespace BajaTours.Api.Services.Payments;

public record MercadoPagoPreference(
    string PreferenceId,
    string InitPoint,
    string SandboxInitPoint);

public record MercadoPagoPaymentInfo(
    string ProviderPaymentId,
    string Status,
    string? StatusDetail,
    decimal Amount,
    string Currency,
    string? ExternalReference,
    string RawJson);

public record MercadoPagoRefundInfo(
    string RefundId,
    string PaymentId,
    decimal Amount,
    string Status,
    string RawJson);

public interface IMercadoPagoService
{
    Task<MercadoPagoPreference> CreatePreferenceAsync(Booking booking, Tour tour, CancellationToken ct);
    Task<MercadoPagoPaymentInfo> GetPaymentAsync(string paymentId, CancellationToken ct);
    Task<MercadoPagoRefundInfo> RefundPaymentAsync(string paymentId, decimal? amount, CancellationToken ct);
}

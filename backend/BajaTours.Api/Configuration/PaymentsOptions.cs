namespace BajaTours.Api.Configuration;

public class PaymentsOptions
{
    public const string SectionName = "Payments";

    public string Mode { get; set; } = "Mock";
    public string FrontendBaseUrl { get; set; } = "http://localhost:5173";
    public string ApiPublicBaseUrl { get; set; } = "http://localhost:5080";
    public MercadoPagoOptions MercadoPago { get; set; } = new();
    public PayPalOptions PayPal { get; set; } = new();
}

public class MercadoPagoOptions
{
    public string AccessToken { get; set; } = string.Empty;
    public string PublicKey { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
    public string ApiBaseUrl { get; set; } = "https://api.mercadopago.com";
}

public class PayPalOptions
{
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string Mode { get; set; } = "sandbox";
}

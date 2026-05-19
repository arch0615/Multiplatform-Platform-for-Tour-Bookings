using System.Security.Cryptography;
using System.Text;

namespace BajaTours.Api.Services.Payments;

public static class MercadoPagoWebhookValidator
{
    public record SignatureParts(string Ts, string V1);

    public enum Result { Valid, Invalid, MissingHeader, MalformedHeader, NoSecretConfigured }

    /// <summary>
    /// Validates a Mercado Pago webhook signature.
    /// MP signs HMAC-SHA256(secret, manifest) where the manifest is
    /// "id:<dataId>;request-id:<requestId>;ts:<ts>;" and the header
    /// x-signature carries "ts=...,v1=...".
    /// </summary>
    public static Result Validate(
        string? webhookSecret,
        string? signatureHeader,
        string? requestId,
        string? dataId)
    {
        if (string.IsNullOrWhiteSpace(webhookSecret)) return Result.NoSecretConfigured;
        if (string.IsNullOrWhiteSpace(signatureHeader)) return Result.MissingHeader;
        if (string.IsNullOrWhiteSpace(dataId)) return Result.MalformedHeader;

        var parts = ParseHeader(signatureHeader);
        if (parts is null) return Result.MalformedHeader;

        var manifest = BuildManifest(dataId, requestId ?? string.Empty, parts.Ts);
        var expected = HmacHex(webhookSecret, manifest);

        return FixedTimeEquals(expected, parts.V1) ? Result.Valid : Result.Invalid;
    }

    public static SignatureParts? ParseHeader(string header)
    {
        string? ts = null, v1 = null;
        foreach (var segment in header.Split(','))
        {
            var trimmed = segment.Trim();
            var eq = trimmed.IndexOf('=');
            if (eq < 0) continue;
            var key = trimmed[..eq].Trim().ToLowerInvariant();
            var value = trimmed[(eq + 1)..].Trim();
            if (key == "ts") ts = value;
            else if (key == "v1") v1 = value;
        }
        if (ts is null || v1 is null) return null;
        return new SignatureParts(ts, v1);
    }

    public static string BuildManifest(string dataId, string requestId, string ts)
        => $"id:{dataId};request-id:{requestId};ts:{ts};";

    public static string HmacHex(string secret, string payload)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var bytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private static bool FixedTimeEquals(string a, string b)
    {
        var aBytes = Encoding.UTF8.GetBytes(a);
        var bBytes = Encoding.UTF8.GetBytes(b);
        return aBytes.Length == bBytes.Length && CryptographicOperations.FixedTimeEquals(aBytes, bBytes);
    }
}

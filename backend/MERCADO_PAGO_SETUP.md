# Mercado Pago — Live Sandbox Runbook

This document is the short, end-to-end procedure for flipping the
Baja Tours backend from `Mock` mode to a real Mercado Pago sandbox.

The code in `Services/Payments/MercadoPagoService.cs` and the webhook
signature validator in `Services/Payments/MercadoPagoWebhookValidator.cs`
are already implemented and tested. Going live is configuration only.


## 1. Create the Mercado Pago sandbox application

1. Sign in (or sign up) at https://www.mercadopago.com.mx/developers
2. Go to **Your applications → Create application**.
   - Product: **Checkout Pro** (hosted checkout)
   - Industry: Tourism / Marketplace
3. Open the application and capture three values from **Credentials → Test**:
   - `Public Key`     → `Payments:MercadoPago:PublicKey`
   - `Access Token`   → `Payments:MercadoPago:AccessToken`
   - `Webhook Secret` (Notifications → Set secret) → `Payments:MercadoPago:WebhookSecret`


## 2. Store the secrets locally

Use `dotnet user-secrets` so production-grade credentials never land in source:

```bash
cd backend/BajaTours.Api
dotnet user-secrets init   # idempotent
dotnet user-secrets set "Payments:MercadoPago:AccessToken"  "TEST-12345-..."
dotnet user-secrets set "Payments:MercadoPago:PublicKey"    "TEST-...-public"
dotnet user-secrets set "Payments:MercadoPago:WebhookSecret" "...-from-MP-portal"
```

User-secrets are loaded automatically in Development. For production set them
as environment variables (the keys above translate one-to-one via the
default config provider).


## 3. Flip the mode

In `appsettings.json` (or `appsettings.Development.json`):

```json
"Payments": {
  "Mode": "MercadoPago",        // was: "Mock"
  "FrontendBaseUrl": "http://localhost:5173",
  "ApiPublicBaseUrl": "https://<your-public-tunnel>",   // see step 4
  "MercadoPago": {
    "ApiBaseUrl": "https://api.mercadopago.com"          // unchanged
    // AccessToken / PublicKey / WebhookSecret come from user-secrets
  }
}
```

`Mode = MercadoPago` switches the DI registration from
`MockMercadoPagoService` to `MercadoPagoService` (the real REST client).
On restart, `/api/bookings` will create real MP preferences and the
`initPoint` returned to the frontend will redirect the user to MP's
hosted checkout instead of `/mock-checkout/...`.


## 4. Make the webhook reachable

Mercado Pago will POST notifications to `notification_url`, which the
backend builds from `Payments:ApiPublicBaseUrl`. The host must be
publicly reachable. For local development:

```bash
# Either ngrok (account required, 2-hour tunnels)
ngrok http 5080

# Or smee.io with the smee-client CLI (no account, persistent URL)
npx smee --url https://smee.io/<your-channel> --target http://localhost:5080
```

Put the public HTTPS URL into `Payments:ApiPublicBaseUrl`. In your
Mercado Pago application's **Notifications** settings, add the same
URL plus `/api/payments/mercadopago/webhook` to the allowed list.


## 5. Test card for the sandbox

| Type      | Number              | CVV | Expiry |
|-----------|---------------------|-----|--------|
| Approved  | 5031 7557 3453 0604 | 123 | 11/30  |
| Pending   | 5031 7557 3453 0604 | 123 | use name "PEND PEND" |
| Rejected  | 5031 7557 3453 0604 | 123 | use name "OTHE OTHE" |

`back_urls.success` will only fire for cards. **OXXO/SPEI never call the
back URLs** — the booking is confirmed via the webhook only. This is
why webhook reliability matters; if your tunnel drops, OXXO payments
end up as Pending in the DB even though MP marks them as approved.


## 6. Verify end-to-end

1. Restart the API (`dotnet run`).
2. From a logged-in client account, book a tour. Step 3 of the booking
   form should redirect to `https://www.mercadopago.com.mx/checkout/v1/...`
   (the real init_point).
3. Pay with the approved test card.
4. MP redirects back to `<FrontendBaseUrl>/booking/success?bookingId=...`.
5. Within seconds the webhook arrives. Tail the API log; you should see:
   ```
   MP webhook signature verified for payment 12345
   ```
6. Refresh the success page — booking flips Pending → Confirmed.

If you see `MP webhook rejected: HMAC mismatch`, the `WebhookSecret`
config doesn't match the value set in the MP portal.

If you see `MP webhook accepted without signature verification`, the
secret is empty in config — fix that before going to production.


## 7. Going to production

Production = same as sandbox but with the **Production** credentials
from MP's portal. Reissue the access token under "Credentials →
Production". Do NOT reuse sandbox tokens in production; they're labelled
`TEST-` and MP will reject real card data.

Other production checklist items live in `IMPLEMENTATION_SCHEDULE.txt`
section 7 (rate limiting, HTTPS, etc.).

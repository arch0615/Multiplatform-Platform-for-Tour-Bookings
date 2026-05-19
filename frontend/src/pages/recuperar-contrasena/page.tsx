import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "@/lib/auth-flows";

export default function ForgotPasswordPage() {
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError(t("auth.required"));
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t("auth.invalidEmail"));
      return;
    }
    setSubmitting(true);
    try {
      // Server always returns 202 — never reveals whether the email exists.
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch {
      // Even on a real error, show the "we sent it" message to prevent enumeration.
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <i className="ri-sailboat-line text-2xl text-turquoise" />
            </div>
            <span className="font-display text-2xl font-bold text-charcoal">Baja Tours</span>
          </Link>
          <h1 className="text-2xl font-bold text-charcoal mb-1">{t("auth.forgotTitle")}</h1>
          <p className="text-sm text-gray-500">{t("auth.forgotSubtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 flex items-center justify-center bg-ocean/10 rounded-full mx-auto mb-4">
                <i className="ri-mail-check-line text-2xl text-ocean" />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">{t("auth.forgotSentTitle")}</h3>
              <p className="text-sm text-gray-500 mb-6">{t("auth.forgotSentDesc")}</p>
              <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-ocean hover:underline">
                <i className="ri-arrow-left-line" />
                {t("auth.backToLogin")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">{t("auth.email")}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                    <i className="ri-mail-line" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                    placeholder="hola@ejemplo.com"
                  />
                </div>
                {error && <p className="text-xs text-coral mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ocean hover:bg-ocean/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-full transition-colors inline-flex items-center justify-center gap-2"
              >
                {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {t("auth.sendResetLink")}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-ocean font-medium hover:underline">
            {t("auth.backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}

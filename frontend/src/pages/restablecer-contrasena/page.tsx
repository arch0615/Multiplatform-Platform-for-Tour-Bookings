import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/lib/api";
import { resetPassword } from "@/lib/auth-flows";

export default function ResetPasswordPage() {
  const { t } = useTranslation("auth");
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!password.trim()) e.password = t("auth.required");
    else if (password.length < 8) e.password = t("auth.passwordMin");
    if (password !== confirm) e.confirm = t("auth.passwordMatch");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!token) {
      setApiError(t("auth.resetTokenMissing", { defaultValue: "Falta el token en el enlace." }));
      return;
    }
    if (!validate()) return;
    setSubmitting(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setApiError(err.message || t("auth.verifyErrorDesc"));
      } else {
        setApiError(t("auth.errGeneric"));
      }
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
          <h1 className="text-2xl font-bold text-charcoal mb-1">{t("auth.resetTitle")}</h1>
          <p className="text-sm text-gray-500">{t("auth.resetSubtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 flex items-center justify-center bg-ocean/10 rounded-full mx-auto mb-4">
                <i className="ri-checkbox-circle-line text-2xl text-ocean" />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">{t("auth.resetSuccessTitle")}</h3>
              <p className="text-sm text-gray-500 mb-6">{t("auth.resetSuccessDesc")}</p>
              <Link to="/login" className="inline-block bg-ocean hover:bg-ocean/90 text-white font-medium px-6 py-2.5 rounded-full transition-colors text-sm">
                {t("auth.signIn")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {apiError && (
                <div className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
                  {apiError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">{t("auth.newPassword")}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                    <i className="ri-lock-line" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
                {errors.password && <p className="text-xs text-coral mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">{t("auth.confirmPassword")}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                    <i className="ri-lock-line" />
                  </div>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
                {errors.confirm && <p className="text-xs text-coral mt-1">{errors.confirm}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ocean hover:bg-ocean/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-full transition-colors inline-flex items-center justify-center gap-2"
              >
                {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {t("auth.resetBtn")}
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

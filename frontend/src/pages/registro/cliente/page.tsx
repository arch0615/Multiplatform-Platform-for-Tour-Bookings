import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ApiError } from "@/lib/api";
import { homeForRole, useAuth } from "@/contexts/AuthContext";

export default function RegistroClientePage() {
  const { t, i18n } = useTranslation("auth");
  const navigate = useNavigate();
  const { registerClient, user, loading } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={homeForRole(user)} replace />;
  }

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = t("auth.required");
    if (!form.email.trim()) e.email = t("auth.required");
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t("auth.invalidEmail");
    if (!form.password.trim()) e.password = t("auth.required");
    else if (form.password.length < 8) e.password = t("auth.passwordMin");
    if (form.password !== form.confirmPassword) e.confirmPassword = t("auth.passwordMatch");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const me = await registerClient({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || undefined,
        preferredLanguage: i18n.language?.split("-")[0] ?? "es",
      });
      navigate(homeForRole(me), { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setApiError(t("auth.errEmailTaken"));
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
          <h1 className="text-2xl font-bold text-charcoal mb-1">{t("auth.registerClientTitle")}</h1>
          <p className="text-sm text-gray-500">{t("auth.registerClientSubtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {apiError && (
              <div className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
                {apiError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">{t("auth.fullName")}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                  <i className="ri-user-line" />
                </div>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>
              {errors.fullName && <p className="text-xs text-coral mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">{t("auth.email")}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                  <i className="ri-mail-line" />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>
              {errors.email && <p className="text-xs text-coral mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">{t("auth.phone")}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                  <i className="ri-phone-line" />
                </div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  autoComplete="tel"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  placeholder="+52"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">{t("auth.password")}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                  <i className="ri-lock-line" />
                </div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
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
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-coral mt-1">{errors.confirmPassword}</p>}
            </div>

            <p className="text-xs text-gray-500">{t("auth.terms")}</p>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ocean hover:bg-ocean/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-full transition-colors"
            >
              {submitting ? t("auth.submitting") : t("auth.registerBtn")}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">{t("auth.or")}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              disabled
              title="Coming soon"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-full py-2.5 text-sm font-medium text-charcoal opacity-50 cursor-not-allowed"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-google-fill" />
              </div>
              {t("auth.google")}
            </button>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-full py-2.5 text-sm font-medium text-charcoal opacity-50 cursor-not-allowed"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-facebook-fill" />
              </div>
              {t("auth.facebook")}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className="text-ocean font-medium hover:underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}

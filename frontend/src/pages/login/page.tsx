import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "@/lib/api";
import { homeForRole, useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    const target = (location.state as { from?: string } | null)?.from ?? homeForRole(user);
    return <Navigate to={target} replace />;
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = t("auth.required");
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = t("auth.invalidEmail");
    if (!password.trim()) e.password = t("auth.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const me = await login(email.trim(), password);
      const target = (location.state as { from?: string } | null)?.from ?? homeForRole(me);
      navigate(target, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setApiError(t("auth.errInvalidCreds"));
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
          <h1 className="text-2xl font-bold text-charcoal mb-1">{t("auth.loginTitle")}</h1>
          <p className="text-sm text-gray-500">{t("auth.loginSubtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {apiError && (
              <div className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
                {apiError}
              </div>
            )}

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
              {errors.email && <p className="text-xs text-coral mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">{t("auth.password")}</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                  <i className="ri-lock-line" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-coral mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-ocean"
                />
                <span className="text-sm text-gray-600">{t("auth.rememberMe")}</span>
              </label>
              <Link to="/recuperar-contrasena" className="text-sm text-ocean hover:underline">
                {t("auth.forgotPassword")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ocean hover:bg-ocean/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-full transition-colors"
            >
              {submitting ? t("auth.submitting") : t("auth.loginBtn")}
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
          {t("auth.noAccount")}{" "}
          <Link to="/registro" className="text-ocean font-medium hover:underline">
            {t("auth.signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}

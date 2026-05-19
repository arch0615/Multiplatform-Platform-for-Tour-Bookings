import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { verifyEmail } from "@/lib/auth-flows";
import { useAuth } from "@/contexts/AuthContext";

type Status = "verifying" | "success" | "error" | "pending";

export default function VerificarEmailPage() {
  const { t } = useTranslation("auth");
  const { token } = useParams<{ token: string }>();
  const { refreshMe } = useAuth();
  const [status, setStatus] = useState<Status>("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    if (token === "pending") {
      // The user just registered; waiting for them to click the link in their inbox.
      setStatus("pending");
      return;
    }

    let cancelled = false;
    setStatus("verifying");
    verifyEmail(token)
      .then(async () => {
        if (cancelled) return;
        setStatus("success");
        // Refresh the auth-context user so EmailVerified flips locally if they're signed in
        await refreshMe();
      })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [token, refreshMe]);

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 flex items-center justify-center">
            <i className="ri-sailboat-line text-2xl text-turquoise" />
          </div>
          <span className="font-display text-2xl font-bold text-charcoal">Baja Tours</span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10">
          {status === "verifying" && (
            <>
              <div className="w-14 h-14 flex items-center justify-center bg-ocean/10 rounded-full mx-auto mb-4">
                <i className="ri-loader-4-line text-2xl text-ocean animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-2">{t("auth.verifyVerifyingTitle")}</h2>
              <p className="text-sm text-gray-500">{t("auth.verifyVerifyingDesc")}</p>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="w-14 h-14 flex items-center justify-center bg-ocean/10 rounded-full mx-auto mb-4">
                <i className="ri-mail-send-line text-2xl text-ocean" />
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-2">{t("auth.verifyingEmail")}</h2>
              <p className="text-sm text-gray-500">{t("auth.checkInbox")}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-14 h-14 flex items-center justify-center bg-ocean/10 rounded-full mx-auto mb-4">
                <i className="ri-checkbox-circle-line text-2xl text-ocean" />
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-2">{t("auth.verifySuccessTitle")}</h2>
              <p className="text-sm text-gray-500 mb-6">{t("auth.verifySuccessDesc")}</p>
              <Link
                to="/perfil"
                className="inline-block bg-ocean hover:bg-ocean/90 text-white font-medium px-6 py-2.5 rounded-full transition-colors text-sm"
              >
                {t("auth.goToAccount", { defaultValue: "Ir a mi cuenta" })}
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-14 h-14 flex items-center justify-center bg-coral/10 rounded-full mx-auto mb-4">
                <i className="ri-close-circle-line text-2xl text-coral" />
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-2">{t("auth.verifyErrorTitle")}</h2>
              <p className="text-sm text-gray-500 mb-6">{t("auth.verifyErrorDesc")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center bg-ocean hover:bg-ocean/90 text-white font-medium px-5 py-2.5 rounded-full transition-colors text-sm"
                >
                  {t("auth.signIn")}
                </Link>
                <Link
                  to="/registro/cliente"
                  className="inline-flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-charcoal font-medium px-5 py-2.5 rounded-full transition-colors text-sm"
                >
                  {t("auth.registerAgain")}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

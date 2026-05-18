import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function RegistroPage() {
  const { t } = useTranslation("auth");

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <i className="ri-sailboat-line text-2xl text-turquoise" />
            </div>
            <span className="font-display text-2xl font-bold text-charcoal">Baja Tours</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">{t("auth.chooseRoleTitle")}</h1>
          <p className="text-sm text-gray-500">{t("auth.chooseRoleSubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Link
            to="/registro/cliente"
            className="group bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:border-ocean/30 hover:shadow-sm transition-all"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-ocean/10 rounded-xl mb-5 group-hover:bg-ocean/20 transition-colors">
              <i className="ri-suitcase-line text-2xl text-ocean" />
            </div>
            <h2 className="text-lg font-bold text-charcoal mb-2">{t("auth.travelerCardTitle")}</h2>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{t("auth.travelerCardDesc")}</p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ocean">
              {t("auth.continueAsTraveler")}
              <i className="ri-arrow-right-line" />
            </span>
          </Link>

          <Link
            to="/registro/proveedor"
            className="group bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:border-coral/30 hover:shadow-sm transition-all"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-coral/10 rounded-xl mb-5 group-hover:bg-coral/20 transition-colors">
              <i className="ri-store-2-line text-2xl text-coral" />
            </div>
            <h2 className="text-lg font-bold text-charcoal mb-2">{t("auth.providerCardTitle")}</h2>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{t("auth.providerCardDesc")}</p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-coral">
              {t("auth.continueAsProvider")}
              <i className="ri-arrow-right-line" />
            </span>
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          {t("auth.hasAccount")}{" "}
          <Link to="/login" className="text-ocean font-medium hover:underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
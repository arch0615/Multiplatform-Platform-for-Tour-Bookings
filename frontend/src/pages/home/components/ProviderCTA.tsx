import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ProviderCTA() {
  const { t } = useTranslation("home");

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-coral rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-coral to-coral/80" />
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 p-8 md:p-12 lg:p-16">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                {t("providerCTA.title")}
              </h2>
              <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6">
                {t("providerCTA.subtitle")}
              </p>
              <Link
                to="/proveedores"
                className="inline-flex items-center gap-2 bg-white text-coral hover:bg-white/95 font-semibold px-6 py-3 rounded-full transition-colors whitespace-nowrap"
              >
                {t("providerCTA.button")}
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-arrow-right-line" />
                </div>
              </Link>
            </div>

            <div className="shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center">
                <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center text-white/30">
                  <i className="ri-store-3-line text-6xl md:text-7xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
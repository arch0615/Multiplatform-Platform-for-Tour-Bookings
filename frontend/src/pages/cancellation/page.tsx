import { useTranslation } from "react-i18next";

export default function CancellationPage() {
  const { t } = useTranslation("legal");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-2">{t("legal.cancelTitle")}</h1>
          <p className="text-sm text-gray-400 mb-10">{t("legal.lastUpdated")} 14 de mayo de 2026</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.c1")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.c1Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.c2")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.c2Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.c3")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.c3Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.c4")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.c4Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.c5")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.c5Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.c6")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.c6Text")}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
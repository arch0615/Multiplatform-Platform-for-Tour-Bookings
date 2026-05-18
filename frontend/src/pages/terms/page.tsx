import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation("legal");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-2">{t("legal.termsTitle")}</h1>
          <p className="text-sm text-gray-400 mb-10">{t("legal.lastUpdated")} 14 de mayo de 2026</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.t1")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.t1Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.t2")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.t2Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.t3")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.t3Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.t4")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.t4Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.t5")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.t5Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.t6")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.t6Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.t7")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.t7Text")}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
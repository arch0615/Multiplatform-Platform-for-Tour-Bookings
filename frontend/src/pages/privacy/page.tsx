import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
  const { t } = useTranslation("legal");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-2">{t("legal.privacyTitle")}</h1>
          <p className="text-sm text-gray-400 mb-10">{t("legal.lastUpdated")} 14 de mayo de 2026</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.p1")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.p1Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.p2")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.p2Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.p3")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.p3Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.p4")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.p4Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.p5")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.p5Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.p6")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.p6Text")}</p>
            </section>
            <section>
              <h2 className="text-base font-bold text-charcoal mb-3">{t("legal.p7")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t("legal.p7Text")}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
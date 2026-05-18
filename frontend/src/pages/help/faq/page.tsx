import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const faqs = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
  { q: "faq.q7", a: "faq.a7" },
  { q: "faq.q8", a: "faq.a8" },
];

export default function FaqPage() {
  const { t } = useTranslation("help");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
              <Link to="/ayuda" className="hover:text-ocean transition-colors">{t("faq.backToHelp")}</Link>
              <i className="ri-arrow-right-s-line" />
              <span className="text-charcoal">{t("faq.title")}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-2">{t("faq.title")}</h1>
            <p className="text-sm text-gray-500">{t("faq.subtitle")}</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-charcoal pr-4">{t(faq.q)}</span>
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}>
                    <i className="ri-arrow-down-s-line" />
                  </div>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{t(faq.a)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 bg-ocean rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-white font-semibold text-base mb-2">{t("faq.ctaTitle")}</h3>
            <p className="text-white/80 text-sm mb-4">{t("faq.ctaDesc")}</p>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-white text-ocean text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors"
            >
              {t("faq.ctaButton")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
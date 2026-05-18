import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const steps = [
  {
    num: 1,
    icon: "ri-search-2-line",
    title: "how.step1Title",
    desc: "how.step1Desc",
    details: ["how.step1d1", "how.step1d2", "how.step1d3"],
    color: "#0B4F6C",
    bgColor: "#E8F4F8",
  },
  {
    num: 2,
    icon: "ri-calendar-check-line",
    title: "how.step2Title",
    desc: "how.step2Desc",
    details: ["how.step2d1", "how.step2d2", "how.step2d3"],
    color: "#FF6B6B",
    bgColor: "#FFF1F1",
  },
  {
    num: 3,
    icon: "ri-emotion-happy-line",
    title: "how.step3Title",
    desc: "how.step3Desc",
    details: ["how.step3d1", "how.step3d2", "how.step3d3"],
    color: "#059669",
    bgColor: "#ECFDF5",
  },
];

const faqs = [
  { q: "how.faq1Q", a: "how.faq1A" },
  { q: "how.faq2Q", a: "how.faq2A" },
  { q: "how.faq3Q", a: "how.faq3A" },
  { q: "how.faq4Q", a: "how.faq4A" },
];

export default function HowItWorksPage() {
  const { t } = useTranslation("about");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="font-display text-2xl md:text-4xl font-bold text-charcoal mb-3">{t("how.title")}</h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">{t("how.subtitle")}</p>
          </div>

          {/* Steps */}
          <div className="space-y-10 md:space-y-14">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute left-10 top-28 w-px h-16 bg-gray-200" />
                )}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <div className="shrink-0 flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: step.bgColor }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        <i className={`${step.icon} text-2xl`} style={{ color: step.color }} />
                      </div>
                    </div>
                    <div
                      className="mt-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.num}
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                    <h3 className="text-lg md:text-xl font-bold text-charcoal mb-2">{t(step.title)}</h3>
                    <p className="text-sm text-gray-500 mb-5">{t(step.desc)}</p>
                    <ul className="space-y-3">
                      {step.details.map((d) => (
                        <li key={d} className="flex items-start gap-3">
                          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-ocean/10 text-ocean shrink-0 mt-0.5">
                            <i className="ri-check-line text-xs" />
                          </div>
                          <span className="text-sm text-gray-600">{t(d)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16">
            {[
              { icon: "ri-secure-payment-line", title: "how.trust1Title", desc: "how.trust1Desc" },
              { icon: "ri-refund-line", title: "how.trust2Title", desc: "how.trust2Desc" },
              { icon: "ri-customer-service-2-line", title: "how.trust3Title", desc: "how.trust3Desc" },
            ].map((tItem) => (
              <div key={tItem.title} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean mx-auto mb-4">
                  <i className={`${tItem.icon} text-xl`} />
                </div>
                <h3 className="font-semibold text-charcoal text-sm mb-2">{t(tItem.title)}</h3>
                <p className="text-xs text-gray-500">{t(tItem.desc)}</p>
              </div>
            ))}
          </div>

          {/* FAQ mini */}
          <div className="mt-16">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal text-center mb-8">{t("how.faqTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((f) => (
                <div key={f.q} className="bg-white rounded-xl border border-gray-100 p-5">
                  <h4 className="font-semibold text-charcoal text-sm mb-2">{t(f.q)}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{t(f.a)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center bg-ocean text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-ocean/90 transition-colors"
            >
              {t("how.ctaButton")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
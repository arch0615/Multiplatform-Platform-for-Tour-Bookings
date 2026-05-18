import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const benefits = [
  { icon: "ri-global-line", title: "provider.b1Title", desc: "provider.b1Desc" },
  { icon: "ri-calendar-event-line", title: "provider.b2Title", desc: "provider.b2Desc" },
  { icon: "ri-secure-payment-line", title: "provider.b3Title", desc: "provider.b3Desc" },
  { icon: "ri-bar-chart-box-line", title: "provider.b4Title", desc: "provider.b4Desc" },
  { icon: "ri-customer-service-2-line", title: "provider.b5Title", desc: "provider.b5Desc" },
  { icon: "ri-star-line", title: "provider.b6Title", desc: "provider.b6Desc" },
];

const steps = [
  { num: 1, title: "provider.s1Title", desc: "provider.s1Desc" },
  { num: 2, title: "provider.s2Title", desc: "provider.s2Desc" },
  { num: 3, title: "provider.s3Title", desc: "provider.s3Desc" },
  { num: 4, title: "provider.s4Title", desc: "provider.s4Desc" },
];

export default function ProviderLandingPage() {
  const { t } = useTranslation("about");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      {/* Hero */}
      <div className="relative h-[400px] md:h-[520px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Happy%20local%20tour%20guide%20showing%20beautiful%20desert%20and%20ocean%20landscape%20to%20a%20small%20group%20of%20tourists%20in%20Baja%20California%20Sur%20Mexico%2C%20authentic%20travel%20experience%20with%20warm%20golden%20light%2C%20adventure%20tourism%20photography%2C%20no%20text&width=1400&height=600&seq=80&orientation=landscape"
          alt="Provider"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">{t("provider.title")}</h1>
            <p className="text-white/90 text-sm md:text-base mb-8">{t("provider.subtitle")}</p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-coral hover:bg-coral/90 text-white text-sm font-medium px-8 py-3 rounded-full transition-colors"
            >
              {t("provider.ctaButton")}
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
            {[
              { num: "15,000+", label: t("provider.statTravelers") },
              { num: "500+", label: t("provider.statTours") },
              { num: "4.8", label: t("provider.statRating") },
              { num: "25+", label: t("provider.statCountries") },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                <p className="text-2xl md:text-3xl font-bold text-ocean mb-1">{s.num}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal text-center mb-10">{t("provider.benefitsTitle")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((b) => (
                <div key={b.title} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean mb-4">
                    <i className={`${b.icon} text-lg`} />
                  </div>
                  <h3 className="font-semibold text-charcoal text-sm mb-2">{t(b.title)}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t(b.desc)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal text-center mb-10">{t("provider.stepsTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((s) => (
                <div key={s.num} className="bg-white rounded-2xl border border-gray-100 p-6 text-center relative">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean text-white text-sm font-bold mx-auto mb-4">
                    {s.num}
                  </div>
                  <h3 className="font-semibold text-charcoal text-sm mb-2">{t(s.title)}</h3>
                  <p className="text-xs text-gray-500">{t(s.desc)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 mb-16">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20friendly%20Mexican%20man%20in%20his%2040s%20with%20warm%20smile%2C%20wearing%20casual%20outdoor%20gear%2C%20neutral%20warm%20studio%20background%2C%20soft%20natural%20lighting%2C%20tourism%20provider%20portrait%20photography&width=200&height=200&seq=81&orientation=squarish"
                alt="Provider"
                className="w-20 h-20 rounded-full object-cover shrink-0"
              />
              <div>
                <p className="text-sm text-gray-600 leading-relaxed italic mb-4">{t("provider.testimonial")}</p>
                <p className="text-sm font-semibold text-charcoal">{t("provider.testimonialName")}</p>
                <p className="text-xs text-gray-500">{t("provider.testimonialRole")}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-ocean rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-3">{t("provider.bottomCtaTitle")}</h2>
            <p className="text-white/80 text-sm max-w-md mx-auto mb-6">{t("provider.bottomCtaDesc")}</p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-coral hover:bg-coral/90 text-white text-sm font-medium px-8 py-3 rounded-full transition-colors"
            >
              {t("provider.ctaButton")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
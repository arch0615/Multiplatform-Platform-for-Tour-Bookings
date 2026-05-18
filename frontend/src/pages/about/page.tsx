import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const team = [
  { name: "Carlos Mendoza", role: "Founder & CEO", img: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20confident%20Mexican%20businessman%20in%20his%2040s%20with%20warm%20smile%2C%20wearing%20casual%20linen%20shirt%2C%20neutral%20beige%20studio%20background%2C%20soft%20natural%20lighting%2C%20corporate%20portrait%20photography%20style&width=200&height=200&seq=50&orientation=squarish" },
  { name: "Ana López", role: "Operations Director", img: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20friendly%20Mexican%20woman%20in%20her%2030s%20with%20confident%20smile%2C%20wearing%20turquoise%20blouse%2C%20neutral%20warm%20studio%20background%2C%20soft%20natural%20lighting%2C%20corporate%20portrait%20photography&width=200&height=200&seq=51&orientation=squarish" },
  { name: "Miguel Torres", role: "Head of Partnerships", img: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20friendly%20Mexican%20man%20in%20his%2030s%20with%20short%20beard%2C%20wearing%20white%20polo%20shirt%2C%20neutral%20warm%20studio%20background%2C%20soft%20natural%20lighting%2C%20corporate%20portrait%20photography&width=200&height=200&seq=52&orientation=squarish" },
  { name: "Sofia Ramírez", role: "Customer Experience Lead", img: "https://readdy.ai/api/search-image?query=Professional%20headshot%20portrait%20of%20a%20warm%20Mexican%20woman%20in%20her%20late%2020s%20with%20friendly%20expression%2C%20wearing%20coral%20colored%20top%2C%20neutral%20warm%20studio%20background%2C%20soft%20natural%20lighting%2C%20corporate%20portrait%20photography&width=200&height=200&seq=53&orientation=squarish" },
];

const values = [
  { icon: "ri-heart-line", title: "about.value1Title", desc: "about.value1Desc" },
  { icon: "ri-shield-check-line", title: "about.value2Title", desc: "about.value2Desc" },
  { icon: "ri-group-line", title: "about.value3Title", desc: "about.value3Desc" },
  { icon: "ri-leaf-line", title: "about.value4Title", desc: "about.value4Desc" },
];

export default function AboutPage() {
  const { t } = useTranslation("about");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      {/* Hero */}
      <div className="relative h-[360px] md:h-[480px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Stunning%20aerial%20panoramic%20view%20of%20Baja%20California%20Sur%20coastline%20with%20turquoise%20Sea%20of%20Cortez%2C%20desert%20mountains%2C%20white%20sand%20beaches%20and%20small%20boats%2C%20warm%20golden%20hour%20lighting%2C%20travel%20destination%20landscape%20photography%2C%20no%20text%2C%20no%20people%20close%20up&width=1400&height=500&seq=40&orientation=landscape"
          alt="Baja California Sur"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">{t("about.title")}</h1>
            <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto">{t("about.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-20">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-4">{t("about.missionTitle")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{t("about.missionP1")}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{t("about.missionP2")}</p>
            </div>
            <div className="rounded-2xl overflow-hidden h-64 md:h-80">
              <img
                src="https://readdy.ai/api/search-image?query=Group%20of%20happy%20tourists%20on%20a%20boat%20tour%20in%20the%20Sea%20of%20Cortez%20Baja%20California%20Sur%20Mexico%20enjoying%20the%20turquoise%20water%20and%20sunny%20day%2C%20authentic%20travel%20experience%20photography%20with%20warm%20natural%20lighting&width=600&height=400&seq=41&orientation=landscape"
                alt="Tourists enjoying Baja"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { num: "500+", label: t("about.statTours") },
              { num: "120+", label: t("about.statProviders") },
              { num: "15K+", label: t("about.statTravelers") },
              { num: "3", label: t("about.statDestinations") },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                <p className="text-2xl md:text-3xl font-bold text-ocean mb-1">{s.num}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal text-center mb-10">{t("about.valuesTitle")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean mb-4">
                    <i className={`${v.icon} text-lg`} />
                  </div>
                  <h3 className="font-semibold text-charcoal text-sm mb-2">{t(v.title)}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t(v.desc)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal text-center mb-10">{t("about.teamTitle")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {team.map((m) => (
                <div key={m.name} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                  <img src={m.img} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
                  <h3 className="font-semibold text-charcoal text-sm">{m.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{m.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-ocean rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-3">{t("about.ctaTitle")}</h2>
            <p className="text-white/80 text-sm max-w-md mx-auto mb-6">{t("about.ctaDesc")}</p>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center bg-white text-ocean text-sm font-medium px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              {t("about.ctaButton")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
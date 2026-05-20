import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { onTourImageError } from "@/lib/imageFallback";

const team = [
  { name: "Carlos Mendoza", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80&auto=format&fit=facearea&facepad=2.5" },
  { name: "Ana López", role: "Operations Director", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80&auto=format&fit=facearea&facepad=2.5" },
  { name: "Miguel Torres", role: "Head of Partnerships", img: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=200&q=80&auto=format&fit=facearea&facepad=2.5" },
  { name: "Sofia Ramírez", role: "Customer Experience Lead", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80&auto=format&fit=facearea&facepad=2.5" },
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
          src="https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1920&q=80&auto=format&fit=crop"
          alt="Baja California Sur"
          onError={onTourImageError}
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
                src="https://images.unsplash.com/photo-1502920514313-52581002a659?w=1200&q=80&auto=format&fit=crop"
                alt="Tourists enjoying Baja"
                onError={onTourImageError}
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
                  <img src={m.img} alt={m.name} onError={onTourImageError} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
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
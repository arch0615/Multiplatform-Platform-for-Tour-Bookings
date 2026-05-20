import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { destinations } from "@/mocks/destinations";
import { tours, mockTourToListItem } from "@/mocks/tours";
import TourCard from "@/pages/tours/components/TourCard";
import { onTourImageError } from "@/lib/imageFallback";

const destinationContent: Record<string, { title: string; desc: string; facts: string[] }> = {
  "la-paz": {
    title: "La Paz",
    desc: "La capital natural de Baja California Sur, donde el mar se encuentra con el desierto en perfecta armonía. Descubre playas vírgenes, avistamiento de ballenas, snorkel con lobos marinos y una gastronomía de clase mundial.",
    facts: [
      "Capital del estado de Baja California Sur",
      "Malecón de 5 km con vista al Mar de Cortés",
      "Isla Espíritu Santo: Patrimonio de la Humanidad",
      "Clima cálido y seco durante todo el año",
    ],
  },
  "los-cabos": {
    title: "Los Cabos",
    desc: "El destino de lujo donde el desierto se encuentra con dos mares. Disfruta de resorts de clase mundial, campos de golf, pesca deportiva y paisajes impresionantes entre Cabo San Lucas y San José del Cabo.",
    facts: [
      "Corredor turístico de 33 km entre los dos Cabos",
      "Más de 20 campos de golf de clase mundial",
      "Pesca deportiva reconocida internacionalmente",
      "El Arco: formación rocosa icónica",
    ],
  },
  "cabo-san-lucas": {
    title: "Cabo San Lucas",
    desc: "El corazón vibrante de Baja California Sur. Conocida por su vida nocturna, playas de ensueño, deportes acuáticos y el icónico Arco en el Land's End. Un destino que combina aventura y relajación.",
    facts: [
      "Punta más meridional de la península",
      "Mar de Cortés y Océano Pacífico en un solo lugar",
      "Avistamiento de ballenas grises en invierno",
      "Vida marina única: tiburón ballena, mantarrayas",
    ],
  },
};

export default function DestinationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation(["home", "tours"]);
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const destData = useMemo(() => destinations.find((d) => d.id === slug), [slug]);
  const content = slug ? destinationContent[slug] : undefined;
  const destTours = useMemo(
    () => (destData ? tours.filter((t) => t.location === destData.name) : []),
    [destData]
  );

  if (!destData || !content) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
            <i className="ri-map-pin-line text-4xl" />
          </div>
          <h1 className="text-xl font-bold text-charcoal mb-2">{t("tours:noResultsTitle")}</h1>
          <Link to="/tours" className="inline-flex bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full">
            {t("tours:backToTours")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      {/* Hero */}
      <div className="relative h-[360px] md:h-[480px] overflow-hidden">
        <img src={destData.image} alt={destData.name} onError={onTourImageError} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-14 px-4 md:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
              <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              <i className="ri-arrow-right-s-line" />
              <Link to="/tours" className="hover:text-white transition-colors">Tours</Link>
              <i className="ri-arrow-right-s-line" />
              <span>{destData.name}</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">{content.title}</h1>
            <p className="text-white/80 text-sm max-w-xl">{destData.description}</p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* About + Facts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-14">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal mb-4">{t("home:destinations.title")}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{content.desc}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-charcoal text-sm mb-4">{t("home:destinations.toursCount")}</h3>
              <ul className="space-y-3">
                {content.facts.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-ocean/10 text-ocean shrink-0 mt-0.5">
                      <i className="ri-check-line text-xs" />
                    </div>
                    <span className="text-sm text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tours */}
          <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal mb-6">
            {destTours.length} {t("home:categories.tourCount")} en {destData.name}
          </h2>

          {destTours.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                <i className="ri-folder-unknow-line text-4xl" />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">{t("tours:noResultsTitle")}</h3>
              <p className="text-sm text-gray-500">{t("tours:noResultsDesc")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {destTours.map((tour) => (
                <TourCard key={tour.id} tour={mockTourToListItem(tour)} priceLocale={priceLocale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
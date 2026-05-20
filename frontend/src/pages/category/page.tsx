import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { categories } from "@/mocks/categories";
import { tours, mockTourToListItem } from "@/mocks/tours";
import TourCard from "@/pages/tours/components/TourCard";
import { onTourImageError } from "@/lib/imageFallback";

const slugToName: Record<string, string> = {
  aventura: "Aventura",
  cultural: "Cultural",
  gastronomico: "Gastronómico",
  transporte: "Transporte",
  hospedaje: "Renta de Casas",
  pesca: "Pesca",
};

const categoryImages: Record<string, string> = {
  aventura: "https://images.unsplash.com/photo-1502943693086-33b5b1cfdf2f?w=1920&q=80&auto=format&fit=crop",
  cultural: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1920&q=80&auto=format&fit=crop",
  gastronomico: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80&auto=format&fit=crop",
  transporte: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80&auto=format&fit=crop",
  hospedaje: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80&auto=format&fit=crop",
  pesca: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80&auto=format&fit=crop",
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation(["home", "tours"]);
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const categoryName = slug ? slugToName[slug] : undefined;
  const categoryData = useMemo(() => categories.find((c) => c.name === categoryName), [categoryName]);
  const categoryTours = useMemo(
    () => (categoryName ? tours.filter((t) => t.category === categoryName) : []),
    [categoryName]
  );

  if (!categoryData || !categoryName) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
            <i className="ri-folder-unknow-line text-4xl" />
          </div>
          <h1 className="text-xl font-bold text-charcoal mb-2">{t("tours:noResultsTitle")}</h1>
          <Link to="/tours" className="inline-flex bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full">
            {t("tours:backToTours")}
          </Link>
        </div>
      </div>
    );
  }

  const heroImg = slug ? categoryImages[slug] : categoryImages["aventura"];

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      {/* Hero */}
      <div className="relative h-[320px] md:h-[420px] overflow-hidden">
        <img src={heroImg} alt={categoryName} onError={onTourImageError} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        <div className="absolute inset-0 flex items-end pb-10 md:pb-14 px-4 md:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
              <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              <i className="ri-arrow-right-s-line" />
              <Link to="/tours" className="hover:text-white transition-colors">Tours</Link>
              <i className="ri-arrow-right-s-line" />
              <span>{categoryName}</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">{categoryName}</h1>
            <p className="text-white/80 text-sm max-w-lg">
              {categoryTours.length} {t("home:categories.tourCount")} {t("tours:resultsFound")}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          {categoryTours.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                <i className="ri-folder-unknow-line text-4xl" />
              </div>
              <h2 className="text-lg font-bold text-charcoal mb-2">{t("tours:noResultsTitle")}</h2>
              <p className="text-sm text-gray-500 mb-4">{t("tours:noResultsDesc")}</p>
              <Link to="/tours" className="inline-flex bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full">
                {t("tours:backToTours")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryTours.map((tour) => (
                <TourCard key={tour.id} tour={mockTourToListItem(tour)} priceLocale={priceLocale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
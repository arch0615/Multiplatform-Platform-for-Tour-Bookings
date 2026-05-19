import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { categories } from "@/mocks/categories";
import { tours, mockTourToListItem } from "@/mocks/tours";
import TourCard from "@/pages/tours/components/TourCard";

const slugToName: Record<string, string> = {
  aventura: "Aventura",
  cultural: "Cultural",
  gastronomico: "Gastronómico",
  transporte: "Transporte",
  hospedaje: "Renta de Casas",
  pesca: "Pesca",
};

const categoryImages: Record<string, string> = {
  aventura: "https://readdy.ai/api/search-image?query=Exciting%20adventure%20activities%20in%20Baja%20California%20Sur%20Mexico%20including%20kayaking%2C%20ATV%20riding%20and%20whale%20watching%20with%20dramatic%20desert%20and%20ocean%20landscape%2C%20turquoise%20water%2C%20action%20sports%20travel%20photography%2C%20warm%20vibrant%20colors%2C%20no%20text&width=1400&height=500&seq=55&orientation=landscape",
  cultural: "https://readdy.ai/api/search-image?query=Colorful%20Mexican%20colonial%20architecture%20and%20traditional%20cultural%20scene%20in%20Baja%20California%20Sur%20with%20artisan%20pottery%2C%20local%20market%20stalls%2C%20warm%20earth%20tones%2C%20authentic%20cultural%20heritage%20photography%2C%20no%20text&width=1400&height=500&seq=56&orientation=landscape",
  gastronomico: "https://readdy.ai/api/search-image?query=Delicious%20Mexican%20gourmet%20seafood%20and%20street%20food%20spread%20in%20Baja%20California%20Sur%20with%20fresh%20fish%20tacos%2C%20local%20wine%2C%20vibrant%20ingredients%20on%20rustic%20wooden%20table%2C%20warm%20sunset%20lighting%2C%20food%20photography%2C%20no%20text&width=1400&height=500&seq=57&orientation=landscape",
  transporte: "https://readdy.ai/api/search-image?query=Luxury%20shuttle%20van%20driving%20along%20scenic%20coastal%20highway%20in%20Baja%20California%20Sur%20Mexico%20with%20desert%20mountains%20and%20turquoise%20ocean%20views%2C%20professional%20transport%20service%20travel%20photography%2C%20no%20text&width=1400&height=500&seq=58&orientation=landscape",
  hospedaje: "https://readdy.ai/api/search-image?query=Beautiful%20beachfront%20vacation%20rental%20home%20in%20Baja%20California%20Sur%20Mexico%20with%20private%20pool%2C%20palm%20trees%2C%20modern%20architecture%20and%20Pacific%20Ocean%20views%2C%20luxury%20vacation%20rental%20photography%2C%20warm%20golden%20light%2C%20no%20text&width=1400&height=500&seq=59&orientation=landscape",
  pesca: "https://readdy.ai/api/search-image?query=Sport%20fishing%20boat%20on%20deep%20blue%20ocean%20in%20Cabo%20San%20Lucas%20Baja%20California%20Sur%20with%20fishing%20gear%20and%20majestic%20marlin%2C%20dramatic%20action%20photography%20with%20clear%20sky%20and%20turquoise%20water%2C%20no%20text&width=1400&height=500&seq=60&orientation=landscape",
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
        <img src={heroImg} alt={categoryName} className="w-full h-full object-cover" />
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
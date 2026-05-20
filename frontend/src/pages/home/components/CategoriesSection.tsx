import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { categories } from "@/mocks/categories";
import { onTourImageError } from "@/lib/imageFallback";

export default function CategoriesSection() {
  const { t } = useTranslation("home");

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-20 bg-offwhite">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal text-center mb-10 md:mb-14">
          {t("categories.title")}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.id === "adventure" ? "aventura" : cat.id === "cultural" ? "cultural" : cat.id === "gastronomic" ? "gastronomico" : cat.id === "transport" ? "transporte" : cat.id === "housing" ? "hospedaje" : cat.id === "fishing" ? "pesca" : cat.id}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="relative w-full aspect-[3/2] overflow-hidden bg-gray-100">
                <img
                  src={cat.image}
                  alt={t(`categories.${cat.id}`)}
                  loading="lazy"
                  onError={onTourImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="px-4 py-3 md:px-5 md:py-4 text-center">
                <h3 className="text-sm md:text-base font-semibold text-charcoal mb-1">
                  {t(`categories.${cat.id}`)}
                </h3>
                <p className="text-xs text-gray-500">
                  {cat.tourCount} {t("categories.tourCount")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
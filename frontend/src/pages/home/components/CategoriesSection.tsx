import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { categories } from "@/mocks/categories";

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
              className="group flex flex-col items-center text-center bg-white rounded-2xl p-5 md:p-6 hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: cat.bgColor }}
              >
                <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                  <i className={`${cat.icon} text-xl md:text-2xl`} style={{ color: cat.color }} />
                </div>
              </div>
              <h3 className="text-sm md:text-base font-semibold text-charcoal mb-1">
                {t(`categories.${cat.id}`)}
              </h3>
              <p className="text-xs text-gray-500">
                {cat.tourCount} {t("categories.tourCount")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { destinations } from "@/mocks/destinations";

export default function DestinationsSection() {
  const { t } = useTranslation("home");

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-20 bg-offwhite">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal text-center mb-10 md:mb-14">
          {t("destinations.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/destino/${dest.id}`}
              className="group relative h-64 md:h-80 rounded-2xl overflow-hidden"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-1">
                  {t(`destinations.${dest.id}`)}
                </h3>
                <p className="text-white/80 text-sm mb-2">{t(`destinations.${dest.id}Desc`)}</p>
                <p className="text-white/70 text-xs">
                  {dest.tourCount} {t("destinations.toursCount")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
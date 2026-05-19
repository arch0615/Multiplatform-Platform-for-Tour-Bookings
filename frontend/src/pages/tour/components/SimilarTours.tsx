import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { listTours, type TourCategory, type TourListItem } from "@/lib/tours";

interface SimilarToursProps {
  currentSlug: string;
  category: TourCategory;
  priceLocale: string;
}

const placeholderImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop";

export default function SimilarTours({ currentSlug, category, priceLocale }: SimilarToursProps) {
  const { t } = useTranslation("tour");
  const [similar, setSimilar] = useState<TourListItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    listTours({ category, sort: "rating", pageSize: 6 })
      .then((items) => {
        if (cancelled) return;
        setSimilar(items.filter((tr) => tr.slug !== currentSlug).slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setSimilar([]);
      });
    return () => { cancelled = true; };
  }, [category, currentSlug]);

  if (similar.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-14">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-charcoal mb-6 md:mb-8">
          {t("similar.title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {similar.map((tour) => {
            const isBestRated = tour.rating >= 4.8 && tour.reviewCount >= 2;
            return (
              <div
                key={tour.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.coverImageUrl ?? placeholderImage}
                    alt={tour.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {isBestRated && (
                    <span className="absolute top-3 left-3 bg-ocean text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {t("bestRated")}
                    </span>
                  )}
                </div>

                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                      <i className="ri-map-pin-line" />
                    </div>
                    <span>{tour.location}</span>
                    <span className="mx-1">·</span>
                    <span>{tour.duration}</span>
                  </div>

                  <h3 className="text-sm md:text-base font-semibold text-charcoal mb-2 line-clamp-2">
                    {tour.title}
                  </h3>

                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                      <div className="w-3.5 h-3.5 flex items-center justify-center text-coral">
                        <i className="ri-star-fill text-xs" />
                      </div>
                      <span className="text-sm font-semibold text-charcoal">{tour.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-400">({tour.reviewCount} {t("reviews")})</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500">{t("from")}</span>
                      <span className="text-lg font-bold text-ocean ml-1">
                        ${tour.priceAdult.toLocaleString(priceLocale)}
                      </span>
                      <span className="text-xs font-normal text-gray-500 ml-1">MXN</span>
                    </div>
                    <Link
                      to={`/tours/${tour.slug}`}
                      className="bg-ocean hover:bg-ocean/90 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                    >
                      {t("bookNow")}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

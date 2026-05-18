import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { tours } from "@/mocks/tours";

export default function FeaturedTours() {
  const { t, i18n } = useTranslation("home");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
            {t("featured.title")}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-ocean hover:text-ocean transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <i className="ri-arrow-left-line" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-ocean hover:text-ocean transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <i className="ri-arrow-right-line" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:-mx-0 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="group shrink-0 w-[280px] md:w-[320px] bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 md:h-52 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                {tour.bestRated && (
                  <span className="absolute top-3 left-3 bg-ocean text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {t("featured.bestRated")}
                  </span>
                )}
                <button
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-charcoal hover:text-coral transition-colors"
                  aria-label={t("featured.saveTour")}
                >
                  <i className="ri-heart-line" />
                </button>
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
                    <span className="text-sm font-semibold text-charcoal">{tour.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">({tour.reviewCount} {t("featured.reviews")})</span>
                  <div className="flex gap-1 ml-auto">
                    {tour.languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 rounded text-gray-600"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500">{t("featured.from")}</span>
                    <span className="text-lg font-bold text-ocean ml-1">
                      ${tour.price.toLocaleString(priceLocale)} <span className="text-xs font-normal text-gray-500">MXN</span>
                    </span>
                    <span className="text-xs text-gray-500 ml-1">{t("featured.perPerson")}</span>
                  </div>
                  <Link
                    to={`/tours/${tour.slug}`}
                    className="bg-ocean hover:bg-ocean/90 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                  >
                    {t("featured.viewDetails")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
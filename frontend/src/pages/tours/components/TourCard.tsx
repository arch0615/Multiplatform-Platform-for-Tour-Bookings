import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { TourListItem } from "@/lib/tours";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { TOUR_IMAGE_PLACEHOLDER, onTourImageError } from "@/lib/imageFallback";

interface TourCardProps {
  tour: TourListItem;
  priceLocale: string;
}

export default function TourCard({ tour, priceLocale }: TourCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const [busy, setBusy] = useState(false);
  const favorited = isFavorite(tour.id);
  const languages = tour.languages
    .split(",")
    .map((l) => l.trim().toUpperCase())
    .filter(Boolean);
  const isBestRated = tour.rating >= 4.8 && tour.reviewCount >= 2;

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }
    if (busy) return;
    setBusy(true);
    try { await toggle(tour.id); }
    catch { /* optimistic update already rolled back */ }
    finally { setBusy(false); }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48 md:h-52 overflow-hidden">
        <img
          src={tour.coverImageUrl ?? TOUR_IMAGE_PLACEHOLDER}
          alt={tour.title}
          loading="lazy"
          onError={onTourImageError}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {isBestRated && (
          <span className="absolute top-3 left-3 bg-ocean text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {t("card.bestRated")}
          </span>
        )}
        <button
          type="button"
          onClick={handleFavorite}
          disabled={busy}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors disabled:opacity-50 ${
            favorited ? "text-coral" : "text-charcoal hover:text-coral"
          }`}
          aria-label={t("card.save")}
          aria-pressed={favorited}
        >
          <i className={favorited ? "ri-heart-fill" : "ri-heart-line"} />
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
            <span className="text-sm font-semibold text-charcoal">{tour.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-400">
            ({tour.reviewCount} {t("card.reviews")})
          </span>
          <div className="flex gap-1 ml-auto">
            {languages.map((lang) => (
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
            <span className="text-xs text-gray-500">{t("card.from")}</span>
            <span className="text-lg font-bold text-ocean ml-1">
              ${tour.priceAdult.toLocaleString(priceLocale)}{" "}
              <span className="text-xs font-normal text-gray-500">MXN</span>
            </span>
            <span className="text-xs text-gray-500 ml-1">{t("card.perPerson")}</span>
          </div>
          <Link
            to={`/tours/${tour.slug}`}
            className="bg-ocean hover:bg-ocean/90 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap"
          >
            {t("card.viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
}

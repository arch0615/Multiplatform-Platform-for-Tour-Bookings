import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientSidebar from "../components/ClientSidebar";
import { ApiError } from "@/lib/api";
import { listMyFavorites, type Favorite } from "@/lib/favorites";
import { useFavorites } from "@/contexts/FavoritesContext";
import { TOUR_IMAGE_PLACEHOLDER, onTourImageError } from "@/lib/imageFallback";

const placeholderImage = TOUR_IMAGE_PLACEHOLDER;

export default function PerfilFavoritosPage() {
  const { t, i18n } = useTranslation("profile");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";
  const { toggle, refresh: refreshIds } = useFavorites();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try { setFavorites(await listMyFavorites()); }
    catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.loadError", { defaultValue: "No pudimos cargar tus favoritos." }));
      setFavorites([]);
    } finally { setLoading(false); }
  }, [t]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleRemove = async (tourId: string) => {
    setBusyId(tourId);
    try {
      await toggle(tourId); // current state is "favorited" → toggle removes
      setFavorites((prev) => prev.filter((f) => f.tourId !== tourId));
    } catch {
      // ignore, optimistic-rollback handled in toggle
      refreshIds();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="favorites" />
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h1 className="text-lg font-bold text-charcoal mb-4">{t("profile.myFavorites")}</h1>

                {error && (
                  <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
                )}

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-56 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <i className="ri-heart-3-line text-3xl" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{t("profile.noFavorites")}</p>
                    <Link to="/tours" className="inline-flex bg-ocean text-white text-sm font-medium px-5 py-2 rounded-full">
                      {t("profile.exploreTours")}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((tour) => (
                      <div key={tour.tourId} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                        <div className="relative">
                          <img
                            src={tour.coverImageUrl ?? placeholderImage}
                            alt={tour.title}
                            loading="lazy"
                            onError={onTourImageError}
                            className="w-full h-40 object-cover"
                          />
                          <button
                            onClick={() => handleRemove(tour.tourId)}
                            disabled={busyId === tour.tourId}
                            aria-label="Quitar de favoritos"
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-coral hover:bg-coral hover:text-white transition-colors disabled:opacity-50"
                          >
                            <i className="ri-heart-3-fill" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-charcoal mb-1 truncate">{tour.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                            <i className="ri-map-pin-line" /> {tour.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-ocean">
                              ${tour.priceAdult.toLocaleString(priceLocale)}{" "}
                              <span className="text-xs font-normal text-gray-400">MXN</span>
                            </span>
                            <Link to={`/tours/${tour.slug}`} className="text-xs font-medium text-ocean hover:underline">
                              {t("profile.viewDetails")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientSidebar from "../components/ClientSidebar";
import { tours } from "@/mocks/tours";

const mockFavorites = [tours[0], tours[6], tours[10], tours[3], tours[8]];

export default function PerfilFavoritosPage() {
  const { t } = useTranslation("profile");
  const [favorites, setFavorites] = useState(mockFavorites);

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
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
                {favorites.length === 0 ? (
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
                      <div key={tour.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                        <div className="relative">
                          <img src={tour.image} alt={tour.title} className="w-full h-40 object-cover" />
                          <button
                            onClick={() => removeFavorite(tour.id)}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-coral hover:bg-coral hover:text-white transition-colors"
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
                            <span className="text-sm font-bold text-ocean">${tour.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">MXN</span></span>
                            <Link to={`/tours/${tour.slug}`} className="text-xs font-medium text-ocean hover:underline">{t("profile.viewDetails")}</Link>
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
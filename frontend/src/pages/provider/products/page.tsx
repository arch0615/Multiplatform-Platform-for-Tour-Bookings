import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProviderSidebar from "../components/ProviderSidebar";
import { ApiError } from "@/lib/api";
import { archiveMyTour, listMyTours, TourStatus, type ProviderTour } from "@/lib/providerTours";
import { TOUR_IMAGE_PLACEHOLDER, onTourImageError } from "@/lib/imageFallback";

type StatusFilter = "all" | "active" | "paused" | "archived";

function statusBadge(s: TourStatus): string {
  if (s === TourStatus.Active) return "bg-ocean/10 text-ocean";
  if (s === TourStatus.Paused) return "bg-sand/60 text-charcoal";
  return "bg-gray-100 text-gray-500";
}

export default function ProviderProducts() {
  const { t, i18n } = useTranslation(["provider", "admin"]);
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [tours, setTours] = useState<ProviderTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");

  const refresh = () => {
    setLoading(true);
    setError(null);
    return listMyTours()
      .then((items) => setTours(items))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : t("provider.loadError", { defaultValue: "No pudimos cargar tus tours." }));
        setTours([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { void refresh(); }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return tours.filter((tr) => {
      const matchSearch = !needle
        || tr.title.toLowerCase().includes(needle)
        || tr.location.toLowerCase().includes(needle);
      const matchStatus = filterStatus === "all"
        || (filterStatus === "active" && tr.status === TourStatus.Active)
        || (filterStatus === "paused" && tr.status === TourStatus.Paused)
        || (filterStatus === "archived" && tr.status === TourStatus.Archived);
      return matchSearch && matchStatus;
    });
  }, [tours, search, filterStatus]);

  const statusLabel = (s: TourStatus): string => {
    if (s === TourStatus.Active) return t("provider.active");
    if (s === TourStatus.Paused) return t("provider.paused");
    return t("provider.archived", { defaultValue: "Archivado" });
  };

  const handleArchive = async (tour: ProviderTour) => {
    const msg = t("provider.archiveConfirm", { defaultValue: "¿Archivar este tour? Dejará de aparecer en el catálogo." });
    if (!window.confirm(msg)) return;
    setArchivingId(tour.id);
    try {
      await archiveMyTour(tour.id);
      await refresh();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : t("provider.archiveError", { defaultValue: "No pudimos archivar el tour." }));
    } finally {
      setArchivingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider.products")}</h1>
                <Link
                  to="/provider/products/new"
                  className="inline-flex items-center justify-center gap-2 bg-ocean text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-ocean/90 transition-colors"
                >
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
                  {t("provider.addTour")}
                </Link>
              </div>

              {error && (
                <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                    <i className="ri-search-line" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("admin:admin.search")}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "active", "paused", "archived"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                        filterStatus === s ? "bg-charcoal text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s === "all"
                        ? t("admin:admin.all")
                        : s === "active" ? t("provider.active")
                        : s === "paused" ? t("provider.paused")
                        : t("provider.archived")}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex animate-pulse">
                      <div className="w-40 h-40 bg-gray-200 shrink-0" />
                      <div className="p-4 flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    {tours.length === 0
                      ? t("provider.noProductsYet", { defaultValue: "Aún no tienes tours publicados. Crea el primero." })
                      : t("provider.noMatches", { defaultValue: "No se encontraron tours con esos filtros." })}
                  </p>
                  {tours.length === 0 && (
                    <Link to="/provider/products/new" className="inline-flex bg-ocean text-white text-sm font-medium px-5 py-2 rounded-full">
                      {t("provider.addTour")}
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((tour) => {
                    const cover = tour.imageUrls[0] ?? TOUR_IMAGE_PLACEHOLDER;
                    return (
                      <div key={tour.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col sm:flex-row sm:h-44">
                        <img
                          src={cover}
                          alt={tour.title}
                          loading="lazy"
                          onError={onTourImageError}
                          className="w-full sm:w-40 h-40 sm:h-full object-cover shrink-0"
                        />
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-charcoal line-clamp-2">{tour.title}</h3>
                            <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge(tour.status)}`}>
                              {statusLabel(tour.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-map-pin-line" /></div>
                            {tour.location}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-time-line" /></div>
                              {tour.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-user-line" /></div>
                              {tour.bookingCount} {t("provider.bookingsCount", { defaultValue: "reservas" })}
                            </span>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-sm font-bold text-ocean">
                              ${tour.priceAdult.toLocaleString(priceLocale)} <span className="text-xs font-normal text-gray-400">MXN</span>
                            </span>
                            <div className="flex gap-3">
                              <Link to={`/provider/products/${tour.id}/edit`} className="text-xs font-medium text-ocean hover:underline">
                                {t("provider.editTour")}
                              </Link>
                              {tour.status !== TourStatus.Archived && (
                                <button
                                  type="button"
                                  onClick={() => handleArchive(tour)}
                                  disabled={archivingId === tour.id}
                                  className="text-xs font-medium text-coral hover:underline disabled:opacity-50"
                                >
                                  {archivingId === tour.id
                                    ? t("provider.archivingEllipsis", { defaultValue: "Archivando..." })
                                    : t("provider.archiveTour", { defaultValue: "Archivar" })}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

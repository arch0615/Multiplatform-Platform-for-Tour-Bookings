import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { tours } from "@/mocks/tours";
import ProviderSidebar from "../components/ProviderSidebar";

const providerTours = tours.slice(0, 8).map((t) => ({
  ...t,
  status: t.id % 3 === 0 ? "paused" : t.id % 5 === 0 ? "draft" : "active",
  bookings: Math.floor(Math.random() * 50) + 5,
}));

export default function ProviderProducts() {
  const { t, i18n } = useTranslation("provider");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused" | "draft">("all");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const filtered = providerTours.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    if (status === "active") return "bg-ocean/10 text-ocean";
    if (status === "paused") return "bg-sand/60 text-charcoal";
    return "bg-gray-100 text-gray-500";
  };

  const statusLabel = (status: string) => {
    if (status === "active") return t("provider.active");
    if (status === "paused") return t("provider.paused");
    return t("provider.draft");
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider.products")}</h1>
                <Link
                  to="/provider/products"
                  className="inline-flex items-center justify-center gap-2 bg-ocean text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-ocean/90 transition-colors"
                >
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line" /></div>
                  {t("provider.addTour")}
                </Link>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                    <i className="ri-search-line" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("admin.search")}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "active", "paused", "draft"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                        filterStatus === s ? "bg-charcoal text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s === "all" ? t("admin.all") : statusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tours grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((tour) => (
                  <div key={tour.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
                    <img src={tour.image} alt={tour.title} className="w-full sm:w-40 h-40 sm:h-auto object-cover shrink-0" />
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
                          {(tour as { bookings: number }).bookings} reservas
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm font-bold text-ocean">${tour.price.toLocaleString(priceLocale)} <span className="text-xs font-normal text-gray-400">MXN</span></span>
                        <div className="flex gap-2">
                          <button className="text-xs font-medium text-ocean hover:underline">{t("provider.editTour")}</button>
                          <button className="text-xs font-medium text-coral hover:underline">{t("provider.deleteTour")}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <p className="text-sm text-gray-500">No se encontraron tours</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
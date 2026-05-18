import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { tours } from "@/mocks/tours";
import TourCard from "./components/TourCard";
import FilterSidebar, { type FilterState } from "./components/FilterSidebar";
import SortSelect from "./components/SortSelect";
import EmptyState from "./components/EmptyState";

const ITEMS_PER_PAGE = 9;

const parseDuration = (d: string): number => {
  const num = parseInt(d, 10);
  return isNaN(num) ? 0 : num;
};

export default function ToursPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);

  const initialDest = searchParams.get("destination") || "";
  const initialCat = searchParams.get("category") || "";

  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    duration: [],
    rating: [],
    languages: [],
    category: initialCat,
    destination: initialDest,
  });

  useEffect(() => {
    const dest = searchParams.get("destination") || "";
    const cat = searchParams.get("category") || "";
    setFilters((prev) => ({
      ...prev,
      destination: dest,
      category: cat,
    }));
    setPage(1);
  }, [searchParams]);

  const clearAll = useCallback(() => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      duration: [],
      rating: [],
      languages: [],
      category: "",
      destination: "",
    });
    setSearchText("");
    setSort("recommended");
    setPage(1);
    setSearchParams({});
  }, [setSearchParams]);

  const filtered = useMemo(() => {
    let result = [...tours];

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.title.toLowerCase().includes(q) ||
          tour.location.toLowerCase().includes(q) ||
          tour.category.toLowerCase().includes(q)
      );
    }

    if (filters.destination) {
      result = result.filter(
        (tour) => tour.location.toLowerCase().replace(/\s/g, "-") === filters.destination
      );
    }

    if (filters.category) {
      result = result.filter((tour) =>
        tour.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.minPrice) {
      result = result.filter((tour) => tour.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((tour) => tour.price <= Number(filters.maxPrice));
    }

    if (filters.duration.length > 0) {
      result = result.filter((tour) => {
        const dur = parseDuration(tour.duration);
        return filters.duration.some((d) => {
          if (d === "short") return dur < 2;
          if (d === "medium") return dur >= 2 && dur < 4;
          if (d === "long") return dur >= 4 && dur <= 6;
          if (d === "fullDay") return dur > 6;
          return false;
        });
      });
    }

    if (filters.rating.length > 0) {
      result = result.filter((tour) =>
        filters.rating.some((r) => {
          if (r === "excellent") return tour.rating >= 4.5;
          if (r === "veryGood") return tour.rating >= 4.0;
          if (r === "good") return tour.rating >= 3.5;
          return false;
        })
      );
    }

    if (filters.languages.length > 0) {
      result = result.filter((tour) =>
        filters.languages.every((lang) => tour.languages.includes(lang))
      );
    }

    switch (sort) {
      case "priceLow":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        break;
    }

    return result;
  }, [searchText, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    count += filters.duration.length;
    count += filters.rating.length;
    count += filters.languages.length;
    if (filters.category) count++;
    if (filters.destination) count++;
    if (searchText) count++;
    return count;
  }, [filters, searchText]);

  const activePills = useMemo(() => {
    const pills: { label: string; onRemove: () => void }[] = [];
    if (filters.destination) {
      pills.push({
        label: filters.destination.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        onRemove: () => setFilters((f) => ({ ...f, destination: "" })),
      });
    }
    if (filters.category) {
      pills.push({
        label: filters.category,
        onRemove: () => setFilters((f) => ({ ...f, category: "" })),
      });
    }
    if (filters.minPrice || filters.maxPrice) {
      pills.push({
        label: `$${filters.minPrice || "0"} - $${filters.maxPrice || "∞"}`,
        onRemove: () => setFilters((f) => ({ ...f, minPrice: "", maxPrice: "" })),
      });
    }
    filters.duration.forEach((d) => {
      pills.push({
        label: t(`filters.${d}`),
        onRemove: () =>
          setFilters((f) => ({ ...f, duration: f.duration.filter((v) => v !== d) })),
      });
    });
    filters.rating.forEach((r) => {
      pills.push({
        label: t(`filters.${r}`),
        onRemove: () =>
          setFilters((f) => ({ ...f, rating: f.rating.filter((v) => v !== r) })),
      });
    });
    filters.languages.forEach((l) => {
      pills.push({
        label: l === "ES" ? t("filters.spanish") : t("filters.english"),
        onRemove: () =>
          setFilters((f) => ({ ...f, languages: f.languages.filter((v) => v !== l) })),
      });
    });
    if (searchText) {
      pills.push({
        label: `"${searchText}"`,
        onRemove: () => setSearchText(""),
      });
    }
    return pills;
  }, [filters, searchText, t]);

  const destOptions = [
    { label: t("destinations.laPaz"), value: "la-paz" },
    { label: t("destinations.losCabos"), value: "los-cabos" },
    { label: t("destinations.caboSanLucas"), value: "cabo-san-lucas" },
  ];

  return (
    <div className="min-h-screen bg-offwhite pt-16 md:pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="w-full px-4 md:px-8 lg:px-12 py-4 md:py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                <i className="ri-search-line" />
              </div>
              <input
                type="text"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                placeholder={t("search.placeholder")}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-ocean transition-colors bg-white"
              />
            </div>

            <div className="relative">
              <select
                value={filters.destination}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, destination: e.target.value }));
                  setPage(1);
                }}
                className="appearance-none w-full md:w-44 pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-ocean transition-colors bg-white cursor-pointer"
              >
                <option value="">{t("filters.destination")}</option>
                {destOptions.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none text-gray-400">
                <i className="ri-arrow-down-s-line" />
              </div>
            </div>

            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, category: e.target.value }));
                  setPage(1);
                }}
                className="appearance-none w-full md:w-44 pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-ocean transition-colors bg-white cursor-pointer"
              >
                <option value="">{t("filters.category")}</option>
                <option value="Aventura">{t("categories.adventure")}</option>
                <option value="Cultural">{t("categories.cultural")}</option>
                <option value="Gastronómico">{t("categories.gastronomic")}</option>
                <option value="Transporte">{t("categories.transport")}</option>
                <option value="Renta de Casas">{t("categories.housing")}</option>
                <option value="Pesca">{t("categories.fishing")}</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none text-gray-400">
                <i className="ri-arrow-down-s-line" />
              </div>
            </div>

            <button
              onClick={() => { setPage(1); }}
              className="bg-coral hover:bg-coral/90 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center justify-center gap-2"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line" />
              </div>
              {t("search.button")}
            </button>
          </div>

          {activePills.length > 0 && (
            <div className="max-w-7xl mx-auto flex items-center gap-2 mt-3 flex-wrap">
              {activePills.map((pill, i) => (
                <button
                  key={i}
                  onClick={pill.onRemove}
                  className="flex items-center gap-1.5 bg-ocean/10 text-ocean text-xs font-medium px-3 py-1.5 rounded-full hover:bg-ocean/20 transition-colors"
                >
                  {pill.label}
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className="ri-close-line" />
                  </div>
                </button>
              ))}
              <button
                onClick={clearAll}
                className="text-xs text-coral hover:text-coral/80 font-medium transition-colors ml-1"
              >
                {t("clearFilters")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="lg:w-64 shrink-0">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                activeCount={activeFilterCount}
                onClear={clearAll}
              />
            </aside>

            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <p className="text-sm text-gray-500">
                  {t("resultsCount", { count: filtered.length })}
                </p>
                <SortSelect value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
              </div>

              {paginated.length === 0 ? (
                <EmptyState onClear={clearAll} />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {paginated.map((tour) => (
                      <TourCard key={tour.id} tour={tour} priceLocale={priceLocale} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8 md:mt-10">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-charcoal hover:border-ocean hover:text-ocean transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-arrow-left-line" />
                        </div>
                        {t("pagination.prev")}
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-ocean text-white"
                              : "border border-gray-200 text-charcoal hover:border-ocean hover:text-ocean"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-charcoal hover:border-ocean hover:text-ocean transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {t("pagination.next")}
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-arrow-right-line" />
                        </div>
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
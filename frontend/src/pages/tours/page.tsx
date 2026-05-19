import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ApiError } from "@/lib/api";
import { listTours, TourCategory, type ListToursParams, type TourListItem } from "@/lib/tours";
import TourCard from "./components/TourCard";
import FilterSidebar, { type FilterState } from "./components/FilterSidebar";
import SortSelect from "./components/SortSelect";
import EmptyState from "./components/EmptyState";

const ITEMS_PER_PAGE = 9;

// Map UI strings ↔ backend enum / canonical location
const categoryByName: Record<string, TourCategory> = {
  Aventura: TourCategory.Adventure,
  Cultural: TourCategory.Cultural,
  "Gastronómico": TourCategory.Gastronomic,
  Transporte: TourCategory.Transport,
  "Renta de Casas": TourCategory.Housing,
  Pesca: TourCategory.Fishing,
};

const locationBySlug: Record<string, string> = {
  "la-paz": "La Paz",
  "los-cabos": "Los Cabos",
  "cabo-san-lucas": "Cabo San Lucas",
};

function parseDurationHours(s: string): number | null {
  // Examples: "8 horas", "1.5 horas", "45 minutos", "Por noche"
  const lower = s.toLowerCase();
  if (lower.includes("noche")) return 12;
  const match = lower.match(/(\d+(?:\.\d+)?)\s*(min|hora)/);
  if (!match) return null;
  const num = parseFloat(match[1]!);
  return match[2] === "min" ? num / 60 : num;
}

function passesDurationBuckets(durationStr: string, buckets: string[]): boolean {
  if (buckets.length === 0) return true;
  const hours = parseDurationHours(durationStr);
  if (hours === null) return true;
  return buckets.some((b) => {
    if (b === "short") return hours < 2;
    if (b === "medium") return hours >= 2 && hours < 4;
    if (b === "long") return hours >= 4 && hours <= 6;
    if (b === "fullDay") return hours > 6;
    return false;
  });
}

function passesRatingBuckets(rating: number, buckets: string[]): boolean {
  if (buckets.length === 0) return true;
  return buckets.some((b) => {
    if (b === "excellent") return rating >= 4.5;
    if (b === "veryGood") return rating >= 4.0;
    if (b === "good") return rating >= 3.5;
    return false;
  });
}

export default function ToursPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const initialDest = searchParams.get("destination") || "";
  const initialCat = searchParams.get("category") || "";

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<NonNullable<ListToursParams["sort"]>>("recommended");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    duration: [],
    rating: [],
    languages: [],
    category: initialCat,
    destination: initialDest,
  });

  const [tours, setTours] = useState<TourListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync URL params (Header search) into filter state
  useEffect(() => {
    const dest = searchParams.get("destination") || "";
    const cat = searchParams.get("category") || "";
    setFilters((prev) => ({ ...prev, destination: dest, category: cat }));
    setPage(1);
  }, [searchParams]);

  // Debounce text search → 300ms
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => clearTimeout(id);
  }, [searchText]);

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

  // Fetch from backend whenever server-side filters change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params: ListToursParams = { pageSize: 100, sort };
    const cat = categoryByName[filters.category];
    if (cat !== undefined) params.category = cat;
    const loc = locationBySlug[filters.destination];
    if (loc) params.location = loc;
    if (filters.minPrice) params.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
    if (filters.languages.length === 1) params.language = filters.languages[0]!.toLowerCase();
    if (debouncedSearch) params.q = debouncedSearch;
    // Top-bucket rating sent server-side; secondary buckets applied client-side
    if (filters.rating.includes("excellent")) params.minRating = 4.5;
    else if (filters.rating.includes("veryGood")) params.minRating = 4.0;
    else if (filters.rating.includes("good")) params.minRating = 3.5;

    listTours(params)
      .then((items) => {
        if (!cancelled) {
          setTours(items);
          setPage(1);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("loadError", { defaultValue: "Could not load tours." }));
        setTours([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [
    debouncedSearch, sort,
    filters.category, filters.destination,
    filters.minPrice, filters.maxPrice,
    filters.languages.join(","),
    filters.rating.join(","),
    t,
  ]);

  // Apply client-side polish filters (duration + multi-language AND constraint)
  const filtered = useMemo(() => {
    let result = tours;
    if (filters.duration.length > 0) {
      result = result.filter((tr) => passesDurationBuckets(tr.duration, filters.duration));
    }
    if (filters.rating.length > 1) {
      result = result.filter((tr) => passesRatingBuckets(tr.rating, filters.rating));
    }
    if (filters.languages.length > 1) {
      // Multi-language AND constraint: tour must include every selected language
      result = result.filter((tr) => {
        const tourLangs = tr.languages.toLowerCase().split(",").map((l) => l.trim());
        return filters.languages.every((sel) => tourLangs.includes(sel.toLowerCase()));
      });
    }
    return result;
  }, [tours, filters.duration, filters.rating, filters.languages]);

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
        onRemove: () => setFilters((f) => ({ ...f, duration: f.duration.filter((v) => v !== d) })),
      });
    });
    filters.rating.forEach((r) => {
      pills.push({
        label: t(`filters.${r}`),
        onRemove: () => setFilters((f) => ({ ...f, rating: f.rating.filter((v) => v !== r) })),
      });
    });
    filters.languages.forEach((l) => {
      pills.push({
        label: l === "ES" ? t("filters.spanish") : t("filters.english"),
        onRemove: () => setFilters((f) => ({ ...f, languages: f.languages.filter((v) => v !== l) })),
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
                onChange={(e) => setSearchText(e.target.value)}
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
                  {loading
                    ? t("loading", { defaultValue: "Cargando..." })
                    : t("resultsCount", { count: filtered.length })}
                </p>
                <SortSelect value={sort} onChange={(v) => { setSort(v as typeof sort); setPage(1); }} />
              </div>

              {error && !loading && (
                <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                      <div className="h-48 md:h-52 bg-gray-200" />
                      <div className="p-4 md:p-5 space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-8 bg-gray-200 rounded w-full mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginated.length === 0 ? (
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

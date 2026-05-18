import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface FilterState {
  minPrice: string;
  maxPrice: string;
  duration: string[];
  rating: string[];
  languages: string[];
  category: string;
  destination: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  activeCount: number;
  onClear: () => void;
}

const durationOptions = [
  { value: "short", max: 2 },
  { value: "medium", min: 2, max: 4 },
  { value: "long", min: 4, max: 6 },
  { value: "fullDay", min: 6 },
];

const ratingOptions = [
  { value: "excellent", min: 4.5 },
  { value: "veryGood", min: 4.0 },
  { value: "good", min: 3.5 },
];

export default function FilterSidebar({ filters, onChange, activeCount, onClear }: FilterSidebarProps) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const update = (key: keyof FilterState, value: unknown) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArray = (key: "duration" | "rating" | "languages", value: string) => {
    const arr = filters[key];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    update(key, next);
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-charcoal mb-4"
      >
        <div className="w-4 h-4 flex items-center justify-center">
          <i className="ri-filter-3-line" />
        </div>
        {t("filters.title")}
        {activeCount > 0 && (
          <span className="bg-ocean text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      <div className={`${mobileOpen ? "block" : "hidden"} lg:block bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-4 lg:mb-0`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-charcoal">{t("filters.title")}</h3>
          {activeCount > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-coral hover:text-coral/80 font-medium transition-colors"
            >
              {t("clearFilters")}
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-3">{t("filters.price")}</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">{t("filters.minPrice")}</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => update("minPrice", e.target.value)}
                  placeholder="0"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-ocean transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">{t("filters.maxPrice")}</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => update("maxPrice", e.target.value)}
                  placeholder="10000"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-ocean transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-3">{t("filters.duration")}</h4>
            <div className="space-y-2">
              {durationOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={filters.duration.includes(opt.value)}
                      onChange={() => toggleArray("duration", opt.value)}
                      className="w-4 h-4 rounded border-gray-300 text-ocean focus:ring-ocean accent-ocean cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-charcoal transition-colors">{t(`filters.${opt.value}`)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-3">{t("filters.rating")}</h4>
            <div className="space-y-2">
              {ratingOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={filters.rating.includes(opt.value)}
                      onChange={() => toggleArray("rating", opt.value)}
                      className="w-4 h-4 rounded border-gray-300 text-ocean focus:ring-ocean accent-ocean cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-charcoal transition-colors">{t(`filters.${opt.value}`)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-charcoal mb-3">{t("filters.language")}</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-4 h-4 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={filters.languages.includes("ES")}
                    onChange={() => toggleArray("languages", "ES")}
                    className="w-4 h-4 rounded border-gray-300 text-ocean focus:ring-ocean accent-ocean cursor-pointer"
                  />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-charcoal transition-colors">{t("filters.spanish")}</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-4 h-4 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={filters.languages.includes("EN")}
                    onChange={() => toggleArray("languages", "EN")}
                    className="w-4 h-4 rounded border-gray-300 text-ocean focus:ring-ocean accent-ocean cursor-pointer"
                  />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-charcoal transition-colors">{t("filters.english")}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
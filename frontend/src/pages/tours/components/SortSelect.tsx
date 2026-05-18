import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { value: "recommended", labelKey: "sort.recommended" },
  { value: "priceLow", labelKey: "sort.priceLow" },
  { value: "priceHigh", labelKey: "sort.priceHigh" },
  { value: "rating", labelKey: "sort.rating" },
  { value: "newest", labelKey: "sort.newest" },
];

export default function SortSelect({ value, onChange }: SortSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-charcoal hover:border-ocean transition-colors"
      >
        <span className="text-gray-500">{t("sort.label")}:</span>
        <span className="font-medium">{t(selected.labelKey)}</span>
        <div className="w-4 h-4 flex items-center justify-center">
          <i className={`ri-arrow-down-s-line transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[220px] z-20">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                value === opt.value ? "text-ocean font-semibold" : "text-charcoal"
              }`}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  onClear: () => void;
}

export default function EmptyState({ onClear }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24">
      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 mb-4">
        <i className="ri-search-2-line text-3xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-charcoal mb-2">{t("noResults")}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-6">{t("noResultsDesc")}</p>
      <button
        onClick={onClear}
        className="bg-ocean hover:bg-ocean/90 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
      >
        {t("clearFilters")}
      </button>
    </div>
  );
}
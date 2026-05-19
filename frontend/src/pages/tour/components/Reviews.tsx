import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReviewSource, type TourReview } from "@/lib/tours";

interface ReviewsProps {
  reviews: TourReview[];
  overallRating: number;
  reviewCount: number;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function sourceLabel(s: ReviewSource): string | null {
  if (s === ReviewSource.Google) return "Google";
  if (s === ReviewSource.TripAdvisor) return "TripAdvisor";
  return null;
}

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function Reviews({ reviews, overallRating, reviewCount }: ReviewsProps) {
  const { t, i18n } = useTranslation("tour");
  const dateLocale = i18n.language === "es" ? "es-MX" : "en-US";
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const maxCount = Math.max(...ratingCounts.map((r) => r.count), 1);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
      <h3 className="text-lg md:text-xl font-bold text-charcoal mb-5">{t("reviews.title")}</h3>

      {reviewCount === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-gray-300">
            <i className="ri-chat-3-line text-3xl" />
          </div>
          <p className="text-sm text-gray-500">{t("reviews.empty", { defaultValue: "Aún no hay reseñas. ¡Sé el primero en reservar!" })}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div className="flex flex-col items-center justify-center bg-offwhite rounded-xl px-6 py-5 shrink-0">
              <span className="text-4xl font-bold text-charcoal">{overallRating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 flex items-center justify-center ${
                      i < Math.round(overallRating) ? "text-coral" : "text-gray-200"
                    }`}
                  >
                    <i className="ri-star-fill text-sm" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {t("reviews.basedOn")} {reviewCount} {t("reviews")}
              </span>
            </div>

            <div className="flex-1 space-y-2">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-charcoal w-3">{star}</span>
                  <div className="w-4 h-4 flex items-center justify-center text-coral">
                    <i className="ri-star-fill text-xs" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-coral rounded-full transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {visibleReviews.map((review) => {
              const isLong = review.comment.length > 200;
              const isExpanded = expanded[review.id];
              const displayText = isLong && !isExpanded
                ? review.comment.slice(0, 200) + "..."
                : review.comment;
              const sLabel = sourceLabel(review.source);

              return (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-5 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-ocean/10 text-ocean text-sm font-semibold flex items-center justify-center shrink-0">
                      {initials(review.authorName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-charcoal">{review.authorName}</span>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-ocean bg-ocean/10 px-2 py-0.5 rounded-full">
                            <div className="w-3 h-3 flex items-center justify-center">
                              <i className="ri-checkbox-circle-fill" />
                            </div>
                            {t("reviews.verified")}
                          </span>
                        )}
                        {sLabel && (
                          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {sLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-3.5 h-3.5 flex items-center justify-center ${
                                i < Math.round(review.rating) ? "text-coral" : "text-gray-200"
                              }`}
                            >
                              <i className="ri-star-fill text-[10px]" />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(review.createdAt, dateLocale)}</span>
                      </div>
                      {review.title && (
                        <p className="text-sm font-semibold text-charcoal mt-2">{review.title}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{displayText}</p>
                      {isLong && (
                        <button
                          onClick={() => toggleExpand(review.id)}
                          className="text-sm text-ocean font-medium mt-1 hover:underline"
                        >
                          {isExpanded ? t("reviews.showLess", { defaultValue: "Mostrar menos" }) : t("reviews.showMore", { defaultValue: "Leer más" })}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {reviews.length > 4 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full mt-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-charcoal hover:border-ocean hover:text-ocean transition-colors"
            >
              {t("reviews.seeAll")} ({reviews.length})
            </button>
          )}
        </>
      )}
    </div>
  );
}

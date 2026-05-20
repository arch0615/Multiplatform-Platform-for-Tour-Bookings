import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../../provider/components/ProviderSidebar";
import { ApiError } from "@/lib/api";
import { listProviderReviews, ReviewSource, ReviewStatus, type ProviderReview } from "@/lib/reviews";

function sourceLabel(s: ReviewSource): string | null {
  if (s === ReviewSource.Google) return "Google";
  if (s === ReviewSource.TripAdvisor) return "TripAdvisor";
  return null;
}

function statusBadge(s: ReviewStatus): { labelKey: string; className: string } | null {
  if (s === ReviewStatus.Pending) return { labelKey: "provider.reviewPending", className: "bg-sand/60 text-charcoal" };
  if (s === ReviewStatus.Rejected) return { labelKey: "provider.reviewRejected", className: "bg-coral/10 text-coral" };
  return null; // approved → no badge, treat as default state
}

export default function ProveedorResenasPage() {
  const { t, i18n } = useTranslation("provider");
  const dateLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listProviderReviews()
      .then((items) => { if (!cancelled) setReviews(items); })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("provider.loadReviewsError"));
        setReviews([]);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const approved = reviews.filter((r) => r.status === ReviewStatus.Approved);
    const avg = approved.length === 0 ? 0 : approved.reduce((s, r) => s + r.rating, 0) / approved.length;
    return { total: reviews.length, approved: approved.length, avg };
  }, [reviews]);

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-charcoal mb-6">{t("provider.reviewsReceived")}</h1>

              {error && (
                <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-2xl font-bold text-charcoal">
                    {stats.avg > 0 ? stats.avg.toFixed(1) : "—"}
                    <span className="text-xs text-coral ml-1"><i className="ri-star-fill" /></span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{t("provider.avgRating")}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-2xl font-bold text-charcoal">{stats.approved}</p>
                  <p className="text-xs text-gray-500 mt-1">{t("provider.reviewsApproved")}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-2xl font-bold text-charcoal">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">{t("provider.reviewsTotal")}</p>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 bg-white border border-gray-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-gray-300">
                    <i className="ri-chat-3-line text-3xl" />
                  </div>
                  <p className="text-sm text-gray-500">{t("provider.noReviewsYet")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => {
                    const src = sourceLabel(r.source);
                    const st = statusBadge(r.status);
                    const initial = r.authorName?.[0]?.toUpperCase() ?? "?";
                    const dateStr = new Date(r.createdAt).toLocaleDateString(dateLocale, { year: "numeric", month: "short", day: "numeric" });
                    return (
                      <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/10 text-ocean font-bold text-sm shrink-0">
                            {initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-sm font-medium text-charcoal">{r.authorName}</span>
                              {src && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{src}</span>
                              )}
                              {!src && r.status === ReviewStatus.Approved && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-ocean/10 text-ocean">{t("provider.verifiedCustomer")}</span>
                              )}
                              {st && (
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${st.className}`}>{t(st.labelKey)}</span>
                              )}
                              <span className="text-xs text-gray-400">{dateStr}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-coral mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i key={i} className={i < r.rating ? "ri-star-fill text-xs" : "ri-star-line text-xs text-gray-200"} />
                              ))}
                              <span className="text-xs text-gray-500 ml-2 truncate max-w-[280px]">{r.tourTitle}</span>
                            </div>
                            {r.title && <p className="text-sm font-semibold text-charcoal mb-1">{r.title}</p>}
                            <p className="text-sm text-gray-600 whitespace-pre-line">{r.comment}</p>
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

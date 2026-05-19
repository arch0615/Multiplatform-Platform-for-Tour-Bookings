import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProviderSidebar from "../components/ProviderSidebar";
import { ApiError } from "@/lib/api";
import {
  getProviderEarnings,
  listProviderBookings,
  type ProviderBooking,
  type ProviderEarnings,
} from "@/lib/providerReports";
import { BookingStatus } from "@/lib/bookings";
import { listMyTours, TourStatus, type ProviderTour } from "@/lib/providerTours";

type Period = "today" | "week" | "month";

function windowFor(period: Period): { from: string; to: string } {
  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  const from = new Date(today);
  if (period === "week") from.setDate(from.getDate() - 6);
  else if (period === "month") from.setDate(from.getDate() - 29);
  return { from: from.toISOString().slice(0, 10), to };
}

function statusBadge(s: BookingStatus): { className: string; key: string } {
  if (s === BookingStatus.Confirmed) return { className: "bg-ocean/10 text-ocean", key: "profile.statusConfirmed" };
  if (s === BookingStatus.Pending) return { className: "bg-sand/60 text-charcoal", key: "profile.statusPending" };
  if (s === BookingStatus.Completed) return { className: "bg-gray-100 text-gray-600", key: "profile.statusCompleted" };
  return { className: "bg-coral/10 text-coral", key: "profile.statusCancelled" };
}

export default function ProviderDashboard() {
  const { t, i18n } = useTranslation(["provider", "profile"]);
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [period, setPeriod] = useState<Period>("week");
  const [earnings, setEarnings] = useState<ProviderEarnings | null>(null);
  const [tours, setTours] = useState<ProviderTour[]>([]);
  const [recent, setRecent] = useState<ProviderBooking[]>([]);
  const [periodBookings, setPeriodBookings] = useState<ProviderBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load: earnings + tours + 10 most recent bookings (no date filter)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getProviderEarnings(),
      listMyTours(),
      listProviderBookings(),
    ])
      .then(([earn, tr, rec]) => {
        if (cancelled) return;
        setEarnings(earn);
        setTours(tr);
        setRecent(rec.slice(0, 5));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("provider:provider.loadError", { defaultValue: "No pudimos cargar el panel." }));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t]);

  // When period changes, fetch bookings inside that window (for the KPIs)
  useEffect(() => {
    let cancelled = false;
    const { from, to } = windowFor(period);
    listProviderBookings({ from, to })
      .then((items) => { if (!cancelled) setPeriodBookings(items); })
      .catch(() => { if (!cancelled) setPeriodBookings([]); });
    return () => { cancelled = true; };
  }, [period]);

  const periodLabels: Record<Period, string> = {
    today: t("provider:provider.revenueToday"),
    week: t("provider:provider.revenueWeek"),
    month: t("provider:provider.revenueMonth"),
  };

  const kpis = useMemo(() => {
    const earned = periodBookings
      .filter((b) => b.status === BookingStatus.Confirmed || b.status === BookingStatus.Completed)
      .reduce((sum, b) => sum + b.netToProvider, 0);
    const newCount = periodBookings.length;
    const ratedTours = tours.filter((tr) => tr.reviewCount > 0);
    const avgRating = ratedTours.length > 0
      ? ratedTours.reduce((s, tr) => s + tr.rating, 0) / ratedTours.length
      : 0;
    const totalReviews = tours.reduce((s, tr) => s + tr.reviewCount, 0);
    const activeCount = tours.filter((tr) => tr.status === TourStatus.Active).length;
    const pausedCount = tours.filter((tr) => tr.status === TourStatus.Paused).length;
    return { earned, newCount, avgRating, totalReviews, activeCount, pausedCount };
  }, [periodBookings, tours]);

  const chartBars = useMemo(() => {
    if (!earnings || earnings.monthly.length === 0) return [];
    const max = Math.max(...earnings.monthly.map((m) => m.net), 1);
    return earnings.monthly.map((m) => ({
      label: m.label,
      heightPct: Math.round((m.net / max) * 100),
      net: m.net,
      bookings: m.bookings,
    }));
  }, [earnings]);

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider:provider.dashboard")}</h1>
                <div className="flex p-1 bg-white border border-gray-200 rounded-full">
                  {(["today", "week", "month"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                        period === p ? "bg-charcoal text-white" : "text-gray-500 hover:text-charcoal"
                      }`}
                    >
                      {periodLabels[p]}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3" />
                      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                        <i className="ri-money-dollar-circle-line text-lg" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">{periodLabels[period]}</span>
                    </div>
                    <p className="text-2xl font-bold text-charcoal">
                      ${kpis.earned.toLocaleString(priceLocale)}
                      <span className="text-xs font-normal text-gray-500 ml-1">{earnings?.currency ?? "MXN"}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{t("provider:provider.revenue")}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-sand/60 text-charcoal">
                        <i className="ri-calendar-check-line text-lg" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">{periodLabels[period]}</span>
                    </div>
                    <p className="text-2xl font-bold text-charcoal">{kpis.newCount}</p>
                    <p className="text-xs text-gray-500 mt-1">{t("provider:provider.bookings")}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-coral/10 text-coral">
                        <i className="ri-star-line text-lg" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">
                        {kpis.totalReviews} {t("profile:profile.reviews", { defaultValue: "reseñas" })}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-charcoal">
                      {kpis.avgRating > 0 ? kpis.avgRating.toFixed(1) : "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{t("provider:provider.rating", { defaultValue: "Calificación" })}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-turquoise/10 text-turquoise">
                        <i className="ri-sailboat-line text-lg" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">
                        {kpis.pausedCount} {t("provider:provider.paused", { defaultValue: "pausados" })}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-charcoal">{kpis.activeCount}</p>
                    <p className="text-xs text-gray-500 mt-1">{t("provider:provider.activeTours", { defaultValue: "Tours activos" })}</p>
                  </div>
                </div>
              )}

              {/* Monthly revenue chart (last 12 months from /provider/earnings) */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-6">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-base font-bold text-charcoal">{t("provider:provider.revenue")} — 12m</h2>
                  {earnings && (
                    <p className="text-sm text-gray-500">
                      {t("provider:provider.netTotal", { defaultValue: "Neto total" })}:{" "}
                      <span className="font-semibold text-charcoal">
                        ${earnings.totalNet.toLocaleString(priceLocale)} {earnings.currency}
                      </span>
                    </p>
                  )}
                </div>
                {chartBars.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-sm text-gray-400">
                    {loading ? t("provider:provider.loading", { defaultValue: "Cargando..." }) : t("provider:provider.noData", { defaultValue: "Sin datos todavía" })}
                  </div>
                ) : (
                  <div className="h-48 flex items-end gap-2">
                    {chartBars.map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group" title={`${bar.label} · $${bar.net.toLocaleString(priceLocale)} · ${bar.bookings} reservas`}>
                        <div
                          className="w-full bg-ocean/20 group-hover:bg-ocean/50 rounded-t-lg transition-colors"
                          style={{ height: `${Math.max(bar.heightPct, 2)}%` }}
                        />
                        <span className="text-[10px] text-gray-400 truncate w-full text-center">{bar.label.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent bookings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-charcoal">{t("provider:provider.bookings")}</h2>
                  <Link to="/proveedor/reservas" className="text-sm text-ocean hover:underline">{t("provider:provider.viewAll")}</Link>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : recent.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-gray-300">
                      <i className="ri-calendar-line text-3xl" />
                    </div>
                    <p className="text-sm text-gray-500">{t("provider:provider.noBookings", { defaultValue: "Aún no tienes reservas." })}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Ref</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Cliente</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tour</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Fecha</th>
                          <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">Total</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((b) => {
                          const badge = statusBadge(b.status);
                          return (
                            <tr key={b.id} className="border-b border-gray-50 last:border-0">
                              <td className="py-3 pr-4 font-mono text-xs text-charcoal">{b.reference}</td>
                              <td className="py-3 pr-4 text-gray-600 truncate max-w-[140px]">{b.customerName}</td>
                              <td className="py-3 pr-4 text-gray-600 truncate max-w-[180px]">{b.tourTitle}</td>
                              <td className="py-3 pr-4 text-gray-500">{b.date}{b.startTime ? ` · ${b.startTime.slice(0, 5)}` : ""}</td>
                              <td className="py-3 pr-4 text-right font-medium text-charcoal">
                                ${b.totalPrice.toLocaleString(priceLocale)} <span className="text-xs font-normal text-gray-500">{b.currency}</span>
                              </td>
                              <td className="py-3">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge.className}`}>
                                  {t(`profile:${badge.key}`)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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

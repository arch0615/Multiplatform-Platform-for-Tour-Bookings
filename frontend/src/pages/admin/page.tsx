import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminLayout from "./components/AdminLayout";
import { ApiError } from "@/lib/api";
import { BookingStatus } from "@/lib/bookings";
import { getAdminStats, listAdminBookings, type AdminBooking, type AdminDashboardStats } from "@/lib/admin";

function formatMoney(value: number, locale: string, currency = "MXN"): string {
  return `$${value.toLocaleString(locale, { maximumFractionDigits: 0 })} ${currency}`;
}

function statusBadge(s: BookingStatus): string {
  if (s === BookingStatus.Confirmed) return "bg-ocean/10 text-ocean";
  if (s === BookingStatus.Pending) return "bg-sand/60 text-charcoal";
  if (s === BookingStatus.Completed) return "bg-gray-100 text-gray-600";
  return "bg-coral/10 text-coral";
}

export default function AdminDashboard() {
  const { t, i18n } = useTranslation("admin");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recent, setRecent] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getAdminStats(), listAdminBookings()])
      .then(([s, b]) => {
        if (cancelled) return;
        setStats(s);
        setRecent(b.slice(0, 8));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("admin.loadError", { defaultValue: "No pudimos cargar el panel." }));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t]);

  const statusLabel = (s: BookingStatus): string => {
    if (s === BookingStatus.Confirmed) return t("admin.statusConfirmed", { defaultValue: "Confirmada" });
    if (s === BookingStatus.Pending) return t("admin.statusPending", { defaultValue: "Pendiente" });
    if (s === BookingStatus.Completed) return t("admin.statusCompleted", { defaultValue: "Completada" });
    return t("admin.statusCancelled", { defaultValue: "Cancelada" });
  };

  return (
    <AdminLayout title={t("admin.title", { defaultValue: "Panel de administración" })}>
      {error && (
        <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-6">{error}</div>
      )}

      {loading || !stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-32 animate-pulse" />
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-72 animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label={t("admin.lifetimeGross", { defaultValue: "Ventas brutas (total)" })}
              value={formatMoney(stats.totalGrossLifetime, priceLocale, stats.currency)}
              icon="ri-money-dollar-circle-line"
              color="bg-ocean/10 text-ocean"
              sub={`${stats.bookingsLifetime} ${t("admin.bookings", { defaultValue: "reservas" })}`}
            />
            <KpiCard
              label={t("admin.commission", { defaultValue: "Comisión total" })}
              value={formatMoney(stats.totalCommissionLifetime, priceLocale, stats.currency)}
              icon="ri-percent-line"
              color="bg-coral/10 text-coral"
            />
            <KpiCard
              label={t("admin.activeProviders", { defaultValue: "Proveedores activos" })}
              value={String(stats.activeProviders)}
              icon="ri-store-2-line"
              color="bg-turquoise/10 text-turquoise"
              sub={stats.pendingProviders > 0
                ? `${stats.pendingProviders} ${t("admin.pendingReview", { defaultValue: "por verificar" })}`
                : undefined}
            />
            <KpiCard
              label={t("admin.activeTours", { defaultValue: "Tours activos" })}
              value={String(stats.activeTours)}
              icon="ri-sailboat-line"
              color="bg-sand/60 text-charcoal"
              sub={`${stats.totalUsers} ${t("admin.totalUsers", { defaultValue: "usuarios totales" })}`}
            />
          </div>

          {/* 30-day summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              label={t("admin.gross30d", { defaultValue: "Ventas últimos 30 días" })}
              value={formatMoney(stats.gross30d, priceLocale, stats.currency)}
              icon="ri-bar-chart-line"
              color="bg-ocean/5 text-ocean"
            />
            <KpiCard
              label={t("admin.commission30d", { defaultValue: "Comisión últimos 30 días" })}
              value={formatMoney(stats.commission30d, priceLocale, stats.currency)}
              icon="ri-coin-line"
              color="bg-coral/5 text-coral"
            />
            <KpiCard
              label={t("admin.bookings30d", { defaultValue: "Reservas últimos 30 días" })}
              value={String(stats.bookings30d)}
              icon="ri-calendar-check-line"
              color="bg-turquoise/5 text-turquoise"
            />
          </div>

          {/* Monthly chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-charcoal mb-4">
              {t("admin.monthlyChart", { defaultValue: "Ventas por mes (últimos 12)" })}
            </h2>
            {stats.monthly.every((m) => m.gross === 0) ? (
              <div className="text-center py-10 text-sm text-gray-500">
                {t("admin.noRevenueYet", { defaultValue: "Aún no hay ingresos para graficar." })}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthly.map((m) => ({ label: m.label.replace(".", "").slice(0, 6), gross: m.gross, commission: m.commission }))} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v: number, name) => [formatMoney(v, priceLocale, stats.currency), name]}
                      contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                    />
                    <Bar dataKey="gross" name={t("admin.gross", { defaultValue: "Ventas brutas" })} fill="#0ea5b7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="commission" name={t("admin.commission", { defaultValue: "Comisión" })} fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Recent bookings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-charcoal">
                {t("admin.recentBookings", { defaultValue: "Reservas recientes" })}
              </h2>
              <Link to="/admin/reservas" className="text-xs font-medium text-ocean hover:underline">
                {t("admin.seeAll", { defaultValue: "Ver todas" })}
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">{t("admin.noBookings", { defaultValue: "Aún no hay reservas." })}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.refColumn", { defaultValue: "Ref" })}</th>
                      <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.customer", { defaultValue: "Cliente" })}</th>
                      <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.tour", { defaultValue: "Tour" })}</th>
                      <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.provider", { defaultValue: "Proveedor" })}</th>
                      <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.total", { defaultValue: "Total" })}</th>
                      <th className="text-left text-xs font-medium text-gray-400 py-3">{t("admin.status", { defaultValue: "Estado" })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((b) => (
                      <tr key={b.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pr-4 font-mono text-xs text-charcoal">{b.reference}</td>
                        <td className="py-3 pr-4 text-charcoal text-sm">{b.customerName}</td>
                        <td className="py-3 pr-4 text-gray-600 truncate max-w-[160px]">{b.tourTitle}</td>
                        <td className="py-3 pr-4 text-gray-500">{b.providerName}</td>
                        <td className="py-3 pr-4 text-right font-medium text-charcoal">{formatMoney(b.totalPrice, priceLocale, b.currency)}</td>
                        <td className="py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusBadge(b.status)}`}>
                            {statusLabel(b.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function KpiCard({ label, value, icon, color, sub }: { label: string; value: string; icon: string; color: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${color} mb-3`}>
        <i className={`${icon} text-lg`} />
      </div>
      <p className="text-2xl font-bold text-charcoal">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

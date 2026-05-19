import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ProviderSidebar from "../../provider/components/ProviderSidebar";
import { ApiError } from "@/lib/api";
import { getProviderEarnings, type ProviderEarnings } from "@/lib/providerReports";

function formatMoney(value: number, locale: string, currency = "MXN"): string {
  return `$${value.toLocaleString(locale, { maximumFractionDigits: 0 })} ${currency}`;
}

export default function ProveedorIngresosPage() {
  const { t, i18n } = useTranslation("provider");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [data, setData] = useState<ProviderEarnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProviderEarnings()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("provider.loadError", { defaultValue: "No pudimos cargar ingresos." }));
        setData(null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t]);

  const chartData = data?.monthly.map((m) => ({
    label: m.label.replace(".", "").slice(0, 6),
    gross: m.gross,
    net: m.net,
    bookings: m.bookings,
  })) ?? [];

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider.earnings")}</h1>
              </div>

              {error && (
                <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-32 animate-pulse" />
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 h-80 animate-pulse" />
                </div>
              ) : !data ? null : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <KpiCard
                      label={t("provider.totalEarnings")}
                      value={formatMoney(data.totalNet, priceLocale, data.currency)}
                      icon="ri-money-dollar-circle-line"
                      color="bg-ocean/10 text-ocean"
                    />
                    <KpiCard
                      label={t("provider.pendingPayout")}
                      value={formatMoney(data.pendingPayout, priceLocale, data.currency)}
                      icon="ri-time-line"
                      color="bg-sand/60 text-charcoal"
                    />
                    <KpiCard
                      label={t("provider.commissionPaid")}
                      value={formatMoney(data.totalCommission, priceLocale, data.currency)}
                      icon="ri-percent-line"
                      color="bg-coral/10 text-coral"
                    />
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-bold text-charcoal">
                        {t("provider.revenueChart", { defaultValue: "Ingresos por mes (últimos 12)" })}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {data.confirmedCount + data.completedCount} {t("provider.bookingsCount", { defaultValue: "reservas" })}
                      </p>
                    </div>
                    {chartData.every((d) => d.gross === 0) ? (
                      <div className="text-center py-12 text-sm text-gray-500">
                        {t("provider.noRevenueYet", { defaultValue: "Aún no hay ingresos para graficar." })}
                      </div>
                    ) : (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis
                              tick={{ fill: "#6b7280", fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
                            />
                            <Tooltip
                              formatter={(v: number, name) => [formatMoney(v, priceLocale, data.currency), name]}
                              contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                            <Bar dataKey="gross" name={t("provider.gross", { defaultValue: "Ventas brutas" })} fill="#0ea5b7" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="net" name={t("provider.net", { defaultValue: "Neto" })} fill="#22c55e" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {data.topTours.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-6">
                      <h2 className="text-base font-bold text-charcoal mb-4">
                        {t("provider.topTours", { defaultValue: "Tours con más ingresos" })}
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.tour", { defaultValue: "Tour" })}</th>
                              <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.bookingsColumn", { defaultValue: "Reservas" })}</th>
                              <th className="text-right text-xs font-medium text-gray-400 py-3">{t("provider.netColumn", { defaultValue: "Neto" })}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.topTours.map((tt) => (
                              <tr key={tt.tourId} className="border-b border-gray-50 last:border-0">
                                <td className="py-3 pr-4 text-charcoal">{tt.title}</td>
                                <td className="py-3 pr-4 text-right text-gray-600">{tt.bookings}</td>
                                <td className="py-3 text-right font-semibold text-ocean">{formatMoney(tt.net, priceLocale, data.currency)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                    <h2 className="text-base font-bold text-charcoal mb-4">
                      {t("provider.monthlyBreakdown", { defaultValue: "Detalle mensual" })}
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.period", { defaultValue: "Periodo" })}</th>
                            <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.bookingsColumn", { defaultValue: "Reservas" })}</th>
                            <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.gross", { defaultValue: "Ventas brutas" })}</th>
                            <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.commissionColumn", { defaultValue: "Comisión" })}</th>
                            <th className="text-right text-xs font-medium text-gray-400 py-3">{t("provider.net", { defaultValue: "Neto" })}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.monthly.map((m) => (
                            <tr key={m.yearMonth} className="border-b border-gray-50 last:border-0">
                              <td className="py-3 pr-4 font-medium text-charcoal">{m.label}</td>
                              <td className="py-3 pr-4 text-right text-gray-600">{m.bookings}</td>
                              <td className="py-3 pr-4 text-right text-gray-600">{formatMoney(m.gross, priceLocale, data.currency)}</td>
                              <td className="py-3 pr-4 text-right text-gray-600">{formatMoney(m.commission, priceLocale, data.currency)}</td>
                              <td className="py-3 text-right font-semibold text-ocean">{formatMoney(m.net, priceLocale, data.currency)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${color} mb-3`}>
        <i className={`${icon} text-lg`} />
      </div>
      <p className="text-2xl font-bold text-charcoal">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

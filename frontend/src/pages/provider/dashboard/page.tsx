import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProviderSidebar from "../components/ProviderSidebar";

const kpiData = [
  { label: "Ingresos de hoy", value: "$3,400", change: "+12%", icon: "ri-money-dollar-circle-line", color: "bg-ocean/10 text-ocean" },
  { label: "Reservas nuevas", value: "8", change: "+3", icon: "ri-calendar-check-line", color: "bg-sand/60 text-charcoal" },
  { label: "Calificación", value: "4.8", change: "98 reseñas", icon: "ri-star-line", color: "bg-coral/10 text-coral" },
  { label: "Tours activos", value: "6", change: "2 pausados", icon: "ri-sailboat-line", color: "bg-turquoise/10 text-turquoise" },
];

const recentBookings = [
  { id: "BK-104", customer: "Ana López", tour: "Snorkel con tiburón ballena", date: "2026-05-20", guests: 3, total: 5400, status: "confirmed" },
  { id: "BK-103", customer: "Carlos Ruiz", tour: "Paseo en kayak bioluminiscente", date: "2026-05-18", guests: 2, total: 3000, status: "confirmed" },
  { id: "BK-102", customer: "Familia Smith", tour: "Avistamiento de ballenas", date: "2026-05-15", guests: 4, total: 9600, status: "completed" },
  { id: "BK-101", customer: "Laura Martínez", tour: "Tour gastronómico La Paz", date: "2026-05-12", guests: 2, total: 2400, status: "completed" },
];

export default function ProviderDashboard() {
  const { t } = useTranslation("provider");
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");

  const periodLabels = { today: t("provider.revenueToday"), week: t("provider.revenueWeek"), month: t("provider.revenueMonth") };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider.dashboard")}</h1>
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

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {kpiData.map((kpi) => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${kpi.color}`}>
                        <i className={`${kpi.icon} text-lg`} />
                      </div>
                      <span className="text-xs font-medium text-gray-400">{kpi.change}</span>
                    </div>
                    <p className="text-2xl font-bold text-charcoal">{kpi.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-6">
                <h2 className="text-base font-bold text-charcoal mb-4">{t("provider.revenue")} — {periodLabels[period]}</h2>
                <div className="h-48 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50, 75, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-ocean/20 rounded-t-lg transition-all hover:bg-ocean/40"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[10px] text-gray-400">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent bookings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-charcoal">{t("provider.bookings")}</h2>
                  <Link to="/provider/calendar" className="text-sm text-ocean hover:underline">{t("provider.viewAll")}</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">ID</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Cliente</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tour</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Fecha</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Total</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => (
                        <tr key={b.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 pr-4 font-medium text-charcoal">{b.id}</td>
                          <td className="py-3 pr-4 text-gray-600">{b.customer}</td>
                          <td className="py-3 pr-4 text-gray-600 truncate max-w-[140px]">{b.tour}</td>
                          <td className="py-3 pr-4 text-gray-500">{b.date}</td>
                          <td className="py-3 pr-4 font-medium text-charcoal">${b.total.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${b.status === "confirmed" ? "bg-ocean/10 text-ocean" : "bg-gray-100 text-gray-600"}`}>
                              {b.status === "confirmed" ? "Confirmada" : "Completada"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
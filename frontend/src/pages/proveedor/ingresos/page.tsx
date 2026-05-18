import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../../provider/components/ProviderSidebar";

const settlements = [
  { id: "SET-2026-05", period: "Mayo 2026", gross: 45200, commission: 6780, net: 38420, status: "paid" },
  { id: "SET-2026-04", period: "Abril 2026", gross: 38100, commission: 5715, net: 32385, status: "paid" },
  { id: "SET-2026-03", period: "Marzo 2026", gross: 28400, commission: 4260, net: 24140, status: "pending" },
];

export default function ProveedorIngresosPage() {
  const { t } = useTranslation("provider");
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider.earnings")}</h1>
                <div className="flex p-1 bg-white border border-gray-200 rounded-full">
                  {(["week", "month", "year"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        period === p ? "bg-charcoal text-white" : "text-gray-500 hover:text-charcoal"
                      }`}
                    >
                      {p === "week" ? "Semana" : p === "month" ? "Mes" : "Año"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: t("provider.totalEarnings"), value: "$111,700", icon: "ri-money-dollar-circle-line", color: "bg-ocean/10 text-ocean" },
                  { label: t("provider.pendingPayout"), value: "$24,140", icon: "ri-time-line", color: "bg-sand/60 text-charcoal" },
                  { label: t("provider.commissionPaid"), value: "$16,755", icon: "ri-percent-line", color: "bg-coral/10 text-coral" },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${kpi.color} mb-3`}>
                      <i className={`${kpi.icon} text-lg`} />
                    </div>
                    <p className="text-2xl font-bold text-charcoal">{kpi.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-6">
                <h2 className="text-base font-bold text-charcoal mb-4">{t("provider.revenueChart")}</h2>
                <div className="h-48 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50, 75, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-ocean/20 rounded-t-lg hover:bg-ocean/40 transition-all" style={{ height: `${h}%` }} />
                      <span className="text-[10px] text-gray-400">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h2 className="text-base font-bold text-charcoal mb-4">{t("provider.settlements")}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Periodo</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Ventas brutas</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Comisión</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Neto</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settlements.map((s) => (
                        <tr key={s.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 pr-4 font-medium text-charcoal">{s.period}</td>
                          <td className="py-3 pr-4 text-gray-600">${s.gross.toLocaleString()}</td>
                          <td className="py-3 pr-4 text-gray-600">${s.commission.toLocaleString()}</td>
                          <td className="py-3 pr-4 font-medium text-ocean">${s.net.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.status === "paid" ? "bg-ocean/10 text-ocean" : "bg-sand/60 text-charcoal"}`}>
                              {s.status === "paid" ? "Pagado" : "Pendiente"}
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
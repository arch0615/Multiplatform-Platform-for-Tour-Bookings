import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

export default function AdminReportesPage() {
  const [activeReport, setActiveReport] = useState<"sales" | "commissions" | "providers" | "products" | "users">("sales");

  const salesData = [
    { month: "Ene", value: 42000 },
    { month: "Feb", value: 38000 },
    { month: "Mar", value: 45000 },
    { month: "Abr", value: 52000 },
    { month: "May", value: 61000 },
  ];

  const maxValue = Math.max(...salesData.map((d) => d.value));

  return (
    <AdminLayout title="Reportes">
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {([
          { key: "sales" as const, label: "Ventas" },
          { key: "commissions" as const, label: "Comisiones" },
          { key: "providers" as const, label: "Top Proveedores" },
          { key: "products" as const, label: "Top Productos" },
          { key: "users" as const, label: "Crecimiento" },
        ]).map((r) => (
          <button
            key={r.key}
            onClick={() => setActiveReport(r.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeReport === r.key ? "bg-ocean text-white" : "bg-white border border-gray-200 text-charcoal hover:bg-gray-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {activeReport === "sales" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Ventas totales (YTD)", value: "$238,000", icon: "ri-money-dollar-circle-line", color: "bg-ocean/10 text-ocean" },
              { label: "Reservas totales", value: "1,247", icon: "ri-calendar-check-line", color: "bg-turquoise/10 text-turquoise" },
              { label: "Ticket promedio", value: "$1,920", icon: "ri-bar-chart-line", color: "bg-coral/10 text-coral" },
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
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
            <h2 className="text-base font-bold text-charcoal mb-4">Ventas mensuales</h2>
            <div className="h-48 flex items-end gap-4">
              {salesData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-ocean/20 rounded-t-lg hover:bg-ocean/40 transition-all"
                    style={{ height: `${(d.value / maxValue) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500">{d.month}</span>
                  <span className="text-xs font-medium text-charcoal">${(d.value / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeReport !== "sales" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
            <i className="ri-bar-chart-grouped-line text-3xl" />
          </div>
          <p className="text-sm text-gray-500">Reporte en desarrollo</p>
        </div>
      )}
    </AdminLayout>
  );
}
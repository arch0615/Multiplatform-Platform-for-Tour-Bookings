import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProviderSidebar from "../../provider/components/ProviderSidebar";

const bookings = [
  { id: "BK-104", customer: "Ana López", tour: "Snorkel con tiburón ballena", date: "2026-05-20", guests: 3, total: 5400, status: "confirmed" },
  { id: "BK-103", customer: "Carlos Ruiz", tour: "Paseo en kayak bioluminiscente", date: "2026-05-18", guests: 2, total: 3000, status: "confirmed" },
  { id: "BK-102", customer: "Familia Smith", tour: "Avistamiento de ballenas", date: "2026-05-15", guests: 4, total: 9600, status: "completed" },
  { id: "BK-101", customer: "Laura Martínez", tour: "Tour gastronómico La Paz", date: "2026-05-12", guests: 2, total: 2400, status: "completed" },
];

export default function ProveedorReservasPage() {
  const { t } = useTranslation("provider");
  const [filter, setFilter] = useState<"all" | "confirmed" | "completed" | "cancelled">("all");

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const statusColor = (s: string) => {
    if (s === "confirmed") return "bg-ocean/10 text-ocean";
    if (s === "completed") return "bg-gray-100 text-gray-600";
    return "bg-coral/10 text-coral";
  };

  const statusLabel = (s: string) => {
    if (s === "confirmed") return "Confirmada";
    if (s === "completed") return "Completada";
    return "Cancelada";
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider.bookings")}</h1>
                <div className="flex gap-2">
                  {(["all", "confirmed", "completed", "cancelled"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filter === f ? "bg-charcoal text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {f === "all" ? "Todas" : statusLabel(f)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">ID</th>
                      <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.customer")}</th>
                      <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.tour")}</th>
                      <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.date")}</th>
                      <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Total</th>
                      <th className="text-left text-xs font-medium text-gray-400 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => (
                      <tr key={b.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 pr-4 font-medium text-charcoal">{b.id}</td>
                        <td className="py-3 pr-4 text-gray-600">{b.customer}</td>
                        <td className="py-3 pr-4 text-gray-600 truncate max-w-[140px]">{b.tour}</td>
                        <td className="py-3 pr-4 text-gray-500">{b.date}</td>
                        <td className="py-3 pr-4 font-medium text-charcoal">${b.total.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(b.status)}`}>{statusLabel(b.status)}</span>
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
  );
}
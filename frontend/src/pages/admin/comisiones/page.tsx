import AdminLayout from "../components/AdminLayout";

const commissions = [
  { id: "SET-2026-05", provider: "EcoPaz Tours", gross: 45200, rate: 15, commission: 6780, net: 38420, status: "paid" },
  { id: "SET-2026-05", provider: "Baja Aventuras", gross: 38100, rate: 15, commission: 5715, net: 32385, status: "paid" },
  { id: "SET-2026-05", provider: "La Paz Gastro", gross: 12400, rate: 12, commission: 1488, net: 10912, status: "pending" },
];

export default function AdminComisionesPage() {
  return (
    <AdminLayout title="Comisiones">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Comisión global", value: "15%", icon: "ri-percent-line", color: "bg-ocean/10 text-ocean" },
          { label: "Total recaudado", value: "$13,983", icon: "ri-money-dollar-circle-line", color: "bg-coral/10 text-coral" },
          { label: "Pendiente", value: "$1,488", icon: "ri-time-line", color: "bg-sand/60 text-charcoal" },
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
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Proveedor</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Ventas</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tasa</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Comisión</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Neto</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((c, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 font-medium text-charcoal">{c.provider}</td>
                <td className="py-3 pr-4 text-gray-600">${c.gross.toLocaleString()}</td>
                <td className="py-3 pr-4 text-gray-600">{c.rate}%</td>
                <td className="py-3 pr-4 font-medium text-coral">${c.commission.toLocaleString()}</td>
                <td className="py-3 pr-4 font-medium text-ocean">${c.net.toLocaleString()}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.status === "paid" ? "bg-ocean/10 text-ocean" : "bg-sand/60 text-charcoal"}`}>
                    {c.status === "paid" ? "Pagado" : "Pendiente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
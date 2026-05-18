import AdminLayout from "../components/AdminLayout";

const bookings = [
  { id: "BK-210", customer: "María García", tour: "Snorkel con tiburón ballena", provider: "EcoPaz Tours", date: "2026-05-20", total: 5400, status: "confirmed" },
  { id: "BK-209", customer: "John Smith", tour: "Paseo en kayak bioluminiscente", provider: "Baja Aventuras", date: "2026-05-19", total: 3000, status: "confirmed" },
  { id: "BK-208", customer: "Laura Martínez", tour: "City tour histórico", provider: "EcoPaz Tours", date: "2026-05-18", total: 800, status: "completed" },
  { id: "BK-207", customer: "Carlos Ruiz", tour: "Pesca deportiva marlín", provider: "Baja Aventuras", date: "2026-05-17", total: 18000, status: "completed" },
];

export default function AdminReservasPage() {
  return (
    <AdminLayout title="Reservas">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">ID</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Cliente</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tour</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Proveedor</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Fecha</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Total</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 font-medium text-charcoal">{b.id}</td>
                <td className="py-3 pr-4 text-gray-600">{b.customer}</td>
                <td className="py-3 pr-4 text-gray-600 truncate max-w-[140px]">{b.tour}</td>
                <td className="py-3 pr-4 text-gray-500">{b.provider}</td>
                <td className="py-3 pr-4 text-gray-500">{b.date}</td>
                <td className="py-3 pr-4 font-medium text-charcoal">${b.total.toLocaleString()}</td>
                <td className="py-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-ocean/10 text-ocean">
                    {b.status === "confirmed" ? "Confirmada" : "Completada"}
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
import AdminLayout from "../components/AdminLayout";

const logs = [
  { id: 1, action: "Inicio de sesión", user: "admin@bajatours.mx", ip: "192.168.1.1", date: "2026-05-20 09:15:32", status: "success" },
  { id: 2, action: "Proveedor aprobado", user: "admin@bajatours.mx", ip: "192.168.1.1", date: "2026-05-20 10:22:11", status: "success" },
  { id: 3, action: "Cupón eliminado", user: "admin@bajatours.mx", ip: "192.168.1.1", date: "2026-05-19 14:45:00", status: "success" },
  { id: 4, action: "Reserva reembolsada", user: "admin@bajatours.mx", ip: "192.168.1.1", date: "2026-05-18 16:30:45", status: "warning" },
];

export default function AdminAuditoriaPage() {
  return (
    <AdminLayout title="Auditoría">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Fecha</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Acción</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Usuario</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">IP</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 text-gray-500">{l.date}</td>
                <td className="py-3 pr-4 font-medium text-charcoal">{l.action}</td>
                <td className="py-3 pr-4 text-gray-600">{l.user}</td>
                <td className="py-3 pr-4 text-gray-500 font-mono">{l.ip}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${l.status === "success" ? "bg-ocean/10 text-ocean" : "bg-coral/10 text-coral"}`}>
                    {l.status === "success" ? "Éxito" : "Advertencia"}
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
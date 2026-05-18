import AdminLayout from "../components/AdminLayout";

const providers = [
  { id: 1, name: "EcoPaz Tours", email: "hola@ecopaz.mx", status: "active", verified: true, tours: 6, revenue: "$45,200", commission: 15 },
  { id: 2, name: "Baja Aventuras", email: "info@bajaaventuras.com", status: "active", verified: true, tours: 8, revenue: "$38,100", commission: 15 },
  { id: 3, name: "Cabo Expeditions", email: "reservas@caboexp.com", status: "pending", verified: false, tours: 3, revenue: "$0", commission: 15 },
  { id: 4, name: "La Paz Gastro", email: "contacto@lapazgastro.mx", status: "active", verified: true, tours: 4, revenue: "$12,400", commission: 12 },
];

export default function AdminProveedoresPage() {
  return (
    <AdminLayout title="Proveedores">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Proveedor</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Email</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tours</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Ingresos</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Estado</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 font-medium text-charcoal">{p.name}</td>
                <td className="py-3 pr-4 text-gray-600">{p.email}</td>
                <td className="py-3 pr-4 text-gray-600">{p.tours}</td>
                <td className="py-3 pr-4 text-gray-600">{p.revenue}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status === "active" ? "bg-ocean/10 text-ocean" : "bg-sand/60 text-charcoal"}`}>
                    {p.status === "active" ? "Activo" : "Pendiente"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    {p.status === "pending" ? (
                      <>
                        <button className="text-xs text-ocean hover:underline">Aprobar</button>
                        <button className="text-xs text-coral hover:underline">Rechazar</button>
                      </>
                    ) : (
                      <button className="text-xs text-coral hover:underline">Suspender</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
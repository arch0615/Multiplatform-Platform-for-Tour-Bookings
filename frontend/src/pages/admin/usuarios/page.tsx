import AdminLayout from "../components/AdminLayout";

const users = [
  { id: 1, name: "María García", email: "maria@ejemplo.com", role: "tourist", bookings: 5, joined: "2025-01-15" },
  { id: 2, name: "Carlos Ruiz", email: "carlos@ejemplo.com", role: "tourist", bookings: 3, joined: "2025-02-20" },
  { id: 3, name: "EcoPaz Tours", email: "hola@ecopaz.mx", role: "provider", bookings: 0, joined: "2025-03-01" },
  { id: 4, name: "Baja Aventuras", email: "info@bajaaventuras.com", role: "provider", bookings: 0, joined: "2025-03-10" },
];

export default function AdminUsuariosPage() {
  return (
    <AdminLayout title="Usuarios">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Nombre</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Email</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Rol</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Reservas</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Registro</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 font-medium text-charcoal">{u.name}</td>
                <td className="py-3 pr-4 text-gray-600">{u.email}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.role === "tourist" ? "bg-turquoise/10 text-turquoise" : "bg-ocean/10 text-ocean"}`}>
                    {u.role === "tourist" ? "Turista" : "Proveedor"}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-600">{u.bookings}</td>
                <td className="py-3 pr-4 text-gray-500">{u.joined}</td>
                <td className="py-3">
                  <button className="text-xs text-coral hover:underline">Suspender</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
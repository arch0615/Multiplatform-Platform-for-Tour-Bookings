import AdminLayout from "../components/AdminLayout";

const products = [
  { id: 1, title: "Snorkel con tiburón ballena", provider: "EcoPaz Tours", category: "Acuático", price: 1800, status: "active", featured: true },
  { id: 2, title: "Paseo en kayak bioluminiscente", provider: "Baja Aventuras", category: "Acuático", price: 1500, status: "active", featured: false },
  { id: 3, title: "City tour histórico", provider: "EcoPaz Tours", category: "Cultural", price: 800, status: "pending", featured: false },
  { id: 4, title: "Pesca deportiva marlín", provider: "Baja Aventuras", category: "Acuático", price: 6000, status: "active", featured: true },
];

export default function AdminProductosPage() {
  return (
    <AdminLayout title="Productos">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tour</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Proveedor</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Categoría</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Precio</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Estado</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 font-medium text-charcoal">{p.title}</td>
                <td className="py-3 pr-4 text-gray-600">{p.provider}</td>
                <td className="py-3 pr-4 text-gray-600">{p.category}</td>
                <td className="py-3 pr-4 font-medium text-charcoal">${p.price.toLocaleString()}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status === "active" ? "bg-ocean/10 text-ocean" : "bg-sand/60 text-charcoal"}`}>
                    {p.status === "active" ? "Activo" : "Pendiente"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    {p.status === "pending" && <button className="text-xs text-ocean hover:underline">Aprobar</button>}
                    <button className="text-xs text-coral hover:underline">{p.featured ? "Quitar destacado" : "Destacar"}</button>
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
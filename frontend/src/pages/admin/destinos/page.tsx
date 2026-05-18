import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const destinations = [
  { id: 1, name: "La Paz", state: "Baja California Sur", tours: 24, featured: true },
  { id: 2, name: "Cabo San Lucas", state: "Baja California Sur", tours: 18, featured: true },
  { id: 3, name: "Todos Santos", state: "Baja California Sur", tours: 8, featured: false },
  { id: 4, name: "Loreto", state: "Baja California Sur", tours: 5, featured: false },
];

export default function AdminDestinosPage() {
  const [items] = useState(destinations);

  return (
    <AdminLayout title="Destinos">
      <div className="flex items-center justify-between mb-4">
        <button className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-medium px-4 py-2 rounded-full">
          <i className="ri-add-line" /> Nuevo destino
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Destino</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Estado</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tours</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Destacado</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 font-medium text-charcoal">{d.name}</td>
                <td className="py-3 pr-4 text-gray-600">{d.state}</td>
                <td className="py-3 pr-4 text-gray-600">{d.tours}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.featured ? "bg-ocean/10 text-ocean" : "bg-gray-100 text-gray-600"}`}>
                    {d.featured ? "Sí" : "No"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button className="text-xs text-ocean hover:underline">Editar</button>
                    <button className="text-xs text-coral hover:underline">Eliminar</button>
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
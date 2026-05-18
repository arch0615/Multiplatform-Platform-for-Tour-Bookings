import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const categories = [
  { id: 1, name: "Acuático", slug: "acuatico", tours: 12, icon: "ri-water-flash-line" },
  { id: 2, name: "Cultural", slug: "cultural", tours: 8, icon: "ri-building-line" },
  { id: 3, name: "Aventura", slug: "aventura", tours: 6, icon: "ri-landscape-line" },
  { id: 4, name: "Gastronómico", slug: "gastronomico", tours: 4, icon: "ri-restaurant-line" },
];

export default function AdminCategoriasPage() {
  const [items] = useState(categories);

  return (
    <AdminLayout title="Categorías">
      <div className="flex items-center justify-between mb-4">
        <button className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-medium px-4 py-2 rounded-full">
          <i className="ri-add-line" /> Nueva categoría
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                <i className={`${c.icon} text-lg`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-charcoal">{c.name}</h3>
                <p className="text-xs text-gray-400">/{c.slug}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{c.tours} tours</span>
              <div className="flex gap-2">
                <button className="text-xs text-ocean hover:underline">Editar</button>
                <button className="text-xs text-coral hover:underline">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
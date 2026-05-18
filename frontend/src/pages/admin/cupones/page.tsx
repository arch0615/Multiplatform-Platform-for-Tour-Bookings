import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const coupons = [
  { id: 1, code: "BAJA10", discount: "10%", type: "percentage", expiry: "2026-06-30", usage: 45, maxUses: 100 },
  { id: 2, code: "VERANO2026", discount: "$500 MXN", type: "fixed", expiry: "2026-08-31", usage: 12, maxUses: 50 },
  { id: 3, code: "FAMILIA", discount: "15%", type: "percentage", expiry: "2026-07-15", usage: 8, maxUses: 30 },
];

export default function AdminCuponesPage() {
  const [items] = useState(coupons);

  return (
    <AdminLayout title="Cupones">
      <div className="flex items-center justify-between mb-4">
        <button className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-medium px-4 py-2 rounded-full">
          <i className="ri-add-line" /> Crear cupón
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Código</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Descuento</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tipo</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Expiración</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Usos</th>
              <th className="text-left text-xs font-medium text-gray-400 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 pr-4 font-mono font-medium text-charcoal">{c.code}</td>
                <td className="py-3 pr-4 text-gray-600">{c.discount}</td>
                <td className="py-3 pr-4 text-gray-600">{c.type === "percentage" ? "Porcentaje" : "Fijo"}</td>
                <td className="py-3 pr-4 text-gray-500">{c.expiry}</td>
                <td className="py-3 pr-4 text-gray-600">{c.usage} / {c.maxUses}</td>
                <td className="py-3">
                  <button className="text-xs text-coral hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
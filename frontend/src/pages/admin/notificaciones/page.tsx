import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const notifications = [
  { id: 1, title: "Nuevo proveedor registrado", message: "Cabo Expeditions se ha registrado y espera verificación", date: "Hace 2 horas", type: "provider" },
  { id: 2, title: "Reserva cancelada", message: "María García canceló la reserva BK-205", date: "Hace 5 horas", type: "booking" },
  { id: 3, title: "Reseña reportada", message: "Mario Vargas reportó una reseña inapropiada", date: "Hace 1 día", type: "review" },
];

export default function AdminNotificacionesPage() {
  const [items] = useState(notifications);

  const typeIcon = (type: string) => {
    if (type === "provider") return "ri-store-2-line";
    if (type === "booking") return "ri-calendar-check-line";
    return "ri-star-line";
  };

  return (
    <AdminLayout title="Notificaciones">
      <div className="space-y-3">
        {items.map((n) => (
          <div key={n.id} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-ocean/10 text-ocean shrink-0">
              <i className={typeIcon(n.type)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-charcoal">{n.title}</h3>
                <span className="text-xs text-gray-400 shrink-0">{n.date}</span>
              </div>
              <p className="text-sm text-gray-600">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
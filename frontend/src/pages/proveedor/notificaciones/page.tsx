import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../../provider/components/ProviderSidebar";

const notifications = [
  { id: 1, title: "Nueva reserva", message: "Ana López reservó Snorkel con tiburón ballena para el 20 de mayo", date: "Hace 2 horas", read: false, type: "booking" },
  { id: 2, title: "Nueva reseña", message: "Pedro Gómez dejó una reseña de 4 estrellas en Tour gastronómico", date: "Hace 5 horas", read: false, type: "review" },
  { id: 3, title: "Pago recibido", message: "Liquidación de abril 2026: $32,385 MXN depositados", date: "Hace 1 día", read: true, type: "payment" },
  { id: 4, title: "Recordatorio", message: "Tour de mañana: Avistamiento de ballenas a las 08:00", date: "Hace 1 día", read: true, type: "reminder" },
];

export default function ProveedorNotificacionesPage() {
  const { t } = useTranslation("provider");
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAsRead = (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filtered = filter === "all" ? items : items.filter((n) => !n.read);

  const typeIcon = (type: string) => {
    if (type === "booking") return "ri-calendar-check-line";
    if (type === "review") return "ri-star-line";
    if (type === "payment") return "ri-money-dollar-circle-line";
    return "ri-time-line";
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider.notifications")}</h1>
                <div className="flex gap-2">
                  <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === "all" ? "bg-charcoal text-white" : "bg-white border border-gray-200 text-gray-600"}`}>Todas</button>
                  <button onClick={() => setFilter("unread")} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filter === "unread" ? "bg-charcoal text-white" : "bg-white border border-gray-200 text-gray-600"}`}>No leídas</button>
                </div>
              </div>
              <div className="space-y-3">
                {filtered.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${n.read ? "bg-white border border-gray-100" : "bg-ocean/5 border border-ocean/10"}`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg shrink-0 ${n.read ? "bg-gray-100 text-gray-400" : "bg-ocean/10 text-ocean"}`}>
                      <i className={typeIcon(n.type)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-semibold ${n.read ? "text-charcoal" : "text-ocean"}`}>{n.title}</h3>
                        <span className="text-xs text-gray-400 shrink-0">{n.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{n.message}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-ocean shrink-0 mt-2" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
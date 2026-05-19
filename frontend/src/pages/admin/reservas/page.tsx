import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../components/AdminLayout";
import { ApiError } from "@/lib/api";
import { BookingStatus } from "@/lib/bookings";
import { listAdminBookings, type AdminBooking } from "@/lib/admin";

type Filter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

function statusToFilter(s: BookingStatus): Filter {
  if (s === BookingStatus.Pending) return "pending";
  if (s === BookingStatus.Confirmed) return "confirmed";
  if (s === BookingStatus.Completed) return "completed";
  return "cancelled";
}

function statusColor(s: BookingStatus): string {
  if (s === BookingStatus.Confirmed) return "bg-ocean/10 text-ocean";
  if (s === BookingStatus.Pending) return "bg-sand/60 text-charcoal";
  if (s === BookingStatus.Completed) return "bg-gray-100 text-gray-600";
  return "bg-coral/10 text-coral";
}

export default function AdminReservasPage() {
  const { t, i18n } = useTranslation("admin");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listAdminBookings()
      .then((items) => { if (!cancelled) setBookings(items); })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("admin.loadError", { defaultValue: "No pudimos cargar reservas." }));
        setBookings([]);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t]);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => statusToFilter(b.status) === filter);

  const statusLabel = (s: BookingStatus): string => {
    if (s === BookingStatus.Confirmed) return t("admin.statusConfirmed", { defaultValue: "Confirmada" });
    if (s === BookingStatus.Pending) return t("admin.statusPending", { defaultValue: "Pendiente" });
    if (s === BookingStatus.Completed) return t("admin.statusCompleted", { defaultValue: "Completada" });
    return t("admin.statusCancelled", { defaultValue: "Cancelada" });
  };

  return (
    <AdminLayout title={t("admin.bookings", { defaultValue: "Reservas" })}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm text-gray-500">
          {loading ? t("admin.loading", { defaultValue: "Cargando..." }) : `${filtered.length} ${t("admin.bookings", { defaultValue: "reservas" })}`}
        </p>
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                filter === f ? "bg-charcoal text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? t("admin.all", { defaultValue: "Todas" })
                : f === "pending" ? t("admin.statusPending", { defaultValue: "Pendiente" })
                : f === "confirmed" ? t("admin.statusConfirmed", { defaultValue: "Confirmada" })
                : f === "completed" ? t("admin.statusCompleted", { defaultValue: "Completada" })
                : t("admin.statusCancelled", { defaultValue: "Cancelada" })}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
              <i className="ri-calendar-line text-3xl" />
            </div>
            <p className="text-sm text-gray-500">
              {bookings.length === 0
                ? t("admin.noBookings", { defaultValue: "Aún no hay reservas en la plataforma." })
                : t("admin.noMatches", { defaultValue: "Sin coincidencias con los filtros." })}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.refColumn", { defaultValue: "Ref" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.customer", { defaultValue: "Cliente" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.tour", { defaultValue: "Tour" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.provider", { defaultValue: "Proveedor" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.date", { defaultValue: "Fecha" })}</th>
                <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.total", { defaultValue: "Total" })}</th>
                <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.commissionColumn", { defaultValue: "Comisión" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3">{t("admin.status", { defaultValue: "Estado" })}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-charcoal">{b.reference}</td>
                  <td className="py-3 pr-4">
                    <div className="text-charcoal text-sm">{b.customerName}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[180px]">{b.customerEmail}</div>
                  </td>
                  <td className="py-3 pr-4 text-gray-600 truncate max-w-[180px]">{b.tourTitle}</td>
                  <td className="py-3 pr-4 text-gray-500">{b.providerName}</td>
                  <td className="py-3 pr-4 text-gray-500">{b.date}{b.startTime ? ` · ${b.startTime.slice(0, 5)}` : ""}</td>
                  <td className="py-3 pr-4 text-right font-medium text-charcoal">
                    ${b.totalPrice.toLocaleString(priceLocale, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 pr-4 text-right text-coral">
                    ${b.commissionAmount.toLocaleString(priceLocale, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusColor(b.status)}`}>
                      {statusLabel(b.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

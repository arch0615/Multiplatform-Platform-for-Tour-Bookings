import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../../provider/components/ProviderSidebar";
import { ApiError } from "@/lib/api";
import { BookingStatus } from "@/lib/bookings";
import { listProviderBookings, type ProviderBooking } from "@/lib/providerReports";

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

export default function ProveedorReservasPage() {
  const { t, i18n } = useTranslation("provider");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [bookings, setBookings] = useState<ProviderBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listProviderBookings()
      .then((items) => { if (!cancelled) setBookings(items); })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("provider.loadError", { defaultValue: "No pudimos cargar reservas." }));
        setBookings([]);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t]);

  const filtered = useMemo(
    () => filter === "all" ? bookings : bookings.filter((b) => statusToFilter(b.status) === filter),
    [bookings, filter],
  );

  const statusLabel = (s: BookingStatus): string => {
    if (s === BookingStatus.Confirmed) return t("provider.statusConfirmed", { defaultValue: "Confirmada" });
    if (s === BookingStatus.Pending) return t("provider.statusPending", { defaultValue: "Pendiente" });
    if (s === BookingStatus.Completed) return t("provider.statusCompleted", { defaultValue: "Completada" });
    return t("provider.statusCancelled", { defaultValue: "Cancelada" });
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider.bookings")}</h1>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filter === f ? "bg-charcoal text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {f === "all"
                        ? t("admin.all", { defaultValue: "Todas" })
                        : f === "pending" ? t("provider.statusPending", { defaultValue: "Pendiente" })
                        : f === "confirmed" ? t("provider.statusConfirmed", { defaultValue: "Confirmada" })
                        : f === "completed" ? t("provider.statusCompleted", { defaultValue: "Completada" })
                        : t("provider.statusCancelled", { defaultValue: "Cancelada" })}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <i className="ri-calendar-line text-3xl" />
                    </div>
                    <p className="text-sm text-gray-500">
                      {bookings.length === 0
                        ? t("provider.noBookings", { defaultValue: "Aún no tienes reservas." })
                        : t("provider.noMatches", { defaultValue: "Sin coincidencias con los filtros." })}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.bookingId", { defaultValue: "ID" })}</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.customer")}</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.tour")}</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.date")}</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.guestsColumn", { defaultValue: "Huéspedes" })}</th>
                        <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.totalColumn", { defaultValue: "Total" })}</th>
                        <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("provider.netColumn", { defaultValue: "Neto" })}</th>
                        <th className="text-left text-xs font-medium text-gray-400 py-3">{t("provider.statusColumn", { defaultValue: "Estado" })}</th>
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
                          <td className="py-3 pr-4 text-gray-600 truncate max-w-[200px]">{b.tourTitle}</td>
                          <td className="py-3 pr-4 text-gray-500">{b.date}{b.startTime ? ` · ${b.startTime.slice(0, 5)}` : ""}</td>
                          <td className="py-3 pr-4 text-gray-600">{b.adults + b.children}</td>
                          <td className="py-3 pr-4 text-right font-medium text-charcoal">${b.totalPrice.toLocaleString(priceLocale)}</td>
                          <td className="py-3 pr-4 text-right font-semibold text-ocean">${b.netToProvider.toLocaleString(priceLocale)}</td>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

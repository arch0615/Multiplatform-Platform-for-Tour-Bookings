import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientSidebar from "../components/ClientSidebar";
import { tours } from "@/mocks/tours";

const mockBookings = [
  { id: "BK-001", tourId: 1, tourTitle: "Snorkel con tiburón ballena", date: "2026-05-20", adults: 2, children: 1, total: 5400, status: "confirmed", image: tours[0].image, bookingId: "BK-001" },
  { id: "BK-002", tourId: 3, tourTitle: "Tour gastronómico La Paz", date: "2026-04-15", adults: 2, children: 0, total: 2400, status: "completed", image: tours[2].image, bookingId: "BK-002" },
  { id: "BK-003", tourId: 5, tourTitle: "City tour histórico", date: "2026-06-10", adults: 1, children: 0, total: 800, status: "pending", image: tours[4].image, bookingId: "BK-003" },
  { id: "BK-004", tourId: 2, tourTitle: "Paseo en kayak bioluminiscente", date: "2026-03-10", adults: 2, children: 0, total: 3000, status: "cancelled", image: tours[1].image, bookingId: "BK-004" },
];

export default function PerfilReservasPage() {
  const { t, i18n } = useTranslation("profile");
  const [filter, setFilter] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const filtered = mockBookings.filter((b) => {
    if (filter === "upcoming") return b.status === "confirmed" || b.status === "pending";
    if (filter === "past") return b.status === "completed";
    return b.status === "cancelled";
  });

  const statusColor = (s: string) => {
    if (s === "confirmed") return "bg-ocean/10 text-ocean";
    if (s === "pending") return "bg-sand/60 text-charcoal";
    if (s === "completed") return "bg-gray-100 text-gray-600";
    return "bg-coral/10 text-coral";
  };

  const statusLabel = (s: string) => {
    if (s === "confirmed") return t("profile.statusConfirmed");
    if (s === "pending") return t("profile.statusPending");
    if (s === "completed") return t("profile.statusCompleted");
    return t("profile.statusCancelled");
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="bookings" />
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h1 className="text-lg font-bold text-charcoal">{t("profile.myBookings")}</h1>
                  <div className="flex gap-2">
                    {(["upcoming", "past", "cancelled"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          filter === f ? "bg-charcoal text-white" : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {t(`profile.${f}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <i className="ri-calendar-line text-3xl" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{t("profile.noBookings")}</p>
                    <Link to="/tours" className="inline-flex bg-ocean text-white text-sm font-medium px-5 py-2 rounded-full">
                      {t("profile.exploreTours")}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filtered.map((b) => (
                      <div key={b.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl">
                        <img src={b.image} alt={b.tourTitle} className="w-full sm:w-32 h-24 object-cover rounded-lg shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-base font-semibold text-charcoal">{b.tourTitle}</h3>
                            <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(b.status)}`}>
                              {statusLabel(b.status)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1"><i className="ri-calendar-line text-xs" /> {b.date}</span>
                            <span className="flex items-center gap-1"><i className="ri-user-line text-xs" /> {b.adults + b.children} {t("profile.guests")}</span>
                            <span className="flex items-center gap-1"><i className="ri-money-dollar-circle-line text-xs" /> ${b.total.toLocaleString(priceLocale)} MXN</span>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Link to={`/perfil/reservas/${b.bookingId}`} className="text-xs font-medium text-ocean hover:underline">
                              {t("profile.viewDetails")}
                            </Link>
                            {b.status === "confirmed" && (
                              <Link to={`/perfil/reservas/${b.bookingId}/cancelar`} className="text-xs font-medium text-coral hover:underline">
                                {t("profile.cancelBooking")}
                              </Link>
                            )}
                            {b.status === "completed" && (
                              <Link to={`/perfil/reservas/${b.bookingId}/resena`} className="text-xs font-medium text-ocean hover:underline">
                                {t("profile.leaveReview")}
                              </Link>
                            )}
                            <Link to={`/voucher/${b.bookingId}`} className="text-xs font-medium text-gray-500 hover:underline">
                              {t("profile.viewVoucher")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
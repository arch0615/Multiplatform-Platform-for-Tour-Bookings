import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientSidebar from "../components/ClientSidebar";
import { ApiError } from "@/lib/api";
import { BookingStatus, listMyBookings, type Booking } from "@/lib/bookings";
import { TOUR_IMAGE_PLACEHOLDER, onTourImageError } from "@/lib/imageFallback";

function isUpcoming(b: Booking, today: string): boolean {
  return b.status === BookingStatus.Pending
    || (b.status === BookingStatus.Confirmed && b.date >= today);
}
function isPast(b: Booking, today: string): boolean {
  return b.status === BookingStatus.Completed
    || (b.status === BookingStatus.Confirmed && b.date < today);
}

function statusColor(s: BookingStatus): string {
  if (s === BookingStatus.Confirmed) return "bg-ocean/10 text-ocean";
  if (s === BookingStatus.Pending) return "bg-sand/60 text-charcoal";
  if (s === BookingStatus.Completed) return "bg-gray-100 text-gray-600";
  return "bg-coral/10 text-coral";
}

export default function PerfilReservasPage() {
  const { t, i18n } = useTranslation("profile");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"upcoming" | "past" | "cancelled">("upcoming");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listMyBookings()
      .then((items) => {
        if (!cancelled) setBookings(items);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("profile.loadError", { defaultValue: "No pudimos cargar tus reservas." }));
        setBookings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [t]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (filter === "upcoming") return isUpcoming(b, today);
      if (filter === "past") return isPast(b, today);
      return b.status === BookingStatus.Cancelled;
    });
  }, [bookings, filter, today]);

  const statusLabel = (s: BookingStatus): string => {
    if (s === BookingStatus.Confirmed) return t("profile.statusConfirmed");
    if (s === BookingStatus.Pending) return t("profile.statusPending");
    if (s === BookingStatus.Completed) return t("profile.statusCompleted");
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

                {error && (
                  <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
                        <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-2/3" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                          <div className="h-3 bg-gray-200 rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
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
                        <img
                          src={b.tour.coverImageUrl ?? TOUR_IMAGE_PLACEHOLDER}
                          alt={b.tour.title}
                          loading="lazy"
                          onError={onTourImageError}
                          className="w-full sm:w-32 h-24 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-base font-semibold text-charcoal">{b.tour.title}</h3>
                            <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(b.status)}`}>
                              {statusLabel(b.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2 font-mono">{b.reference}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <i className="ri-calendar-line text-xs" /> {b.date}{b.startTime ? ` · ${b.startTime.slice(0, 5)}` : ""}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="ri-user-line text-xs" /> {b.adults + b.children} {t("profile.guests")}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="ri-money-dollar-circle-line text-xs" /> ${b.totalPrice.toLocaleString(priceLocale)} {b.currency}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Link to={`/perfil/reservas/${b.id}`} className="text-xs font-medium text-ocean hover:underline">
                              {t("profile.viewDetails")}
                            </Link>
                            {b.status === BookingStatus.Confirmed && b.date >= today && (
                              <Link to={`/perfil/reservas/${b.id}/cancelar`} className="text-xs font-medium text-coral hover:underline">
                                {t("profile.cancelBooking")}
                              </Link>
                            )}
                            {b.status === BookingStatus.Completed && (
                              <Link to={`/perfil/reservas/${b.id}/resena`} className="text-xs font-medium text-ocean hover:underline">
                                {t("profile.leaveReview")}
                              </Link>
                            )}
                            <Link to={`/voucher/${b.id}`} className="text-xs font-medium text-gray-500 hover:underline">
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

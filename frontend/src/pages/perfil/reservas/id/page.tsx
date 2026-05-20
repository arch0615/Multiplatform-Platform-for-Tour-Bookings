import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import ClientSidebar from "../../components/ClientSidebar";
import { ApiError } from "@/lib/api";
import { BookingStatus, getBooking, PaymentStatus, type Booking } from "@/lib/bookings";
import { TOUR_IMAGE_PLACEHOLDER, onTourImageError } from "@/lib/imageFallback";

const placeholderImage = TOUR_IMAGE_PLACEHOLDER;

type TimelineStep = { event: string; date: string | null; done: boolean };

function buildTimeline(b: Booking): TimelineStep[] {
  const paid = b.payment?.status === PaymentStatus.Approved;
  const confirmed = b.status === BookingStatus.Confirmed || b.status === BookingStatus.Completed;
  const completed = b.status === BookingStatus.Completed;
  const cancelled = b.status === BookingStatus.Cancelled;

  if (cancelled) {
    return [
      { event: "booking_created", date: b.createdAt, done: true },
      { event: "booking_cancelled", date: null, done: true },
    ];
  }
  return [
    { event: "booking_created", date: b.createdAt, done: true },
    { event: "payment_received", date: null, done: paid },
    { event: "booking_confirmed", date: null, done: confirmed },
    { event: "tour_completed", date: null, done: completed },
  ];
}

function paymentMethodLabel(b: Booking): string {
  if (!b.payment) return "—";
  // PaymentProvider: 0 = MercadoPago, 1 = PayPal
  return b.payment.provider === 0 ? "Mercado Pago" : "PayPal";
}

function statusColor(s: BookingStatus): string {
  if (s === BookingStatus.Confirmed) return "bg-ocean/10 text-ocean";
  if (s === BookingStatus.Pending) return "bg-sand/60 text-charcoal";
  if (s === BookingStatus.Completed) return "bg-gray-100 text-gray-600";
  return "bg-coral/10 text-coral";
}

export default function PerfilReservaDetallePage() {
  const { t, i18n } = useTranslation("profile");
  const { id } = useParams<{ id: string }>();
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";
  const dateLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getBooking(id)
      .then((b) => { if (!cancelled) setBooking(b); })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 403)) {
          setNotFound(true);
        }
        setBooking(null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-ocean border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <ClientSidebar active="bookings" />
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <i className="ri-calendar-line text-3xl" />
                  </div>
                  <p className="text-sm text-gray-500">{t("profile.bookingNotFound")}</p>
                  <Link to="/perfil/reservas" className="inline-flex mt-4 bg-ocean text-white text-sm font-medium px-5 py-2 rounded-full">
                    {t("profile.backToBookings")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusLabel = (s: BookingStatus): string => {
    if (s === BookingStatus.Confirmed) return t("profile.statusConfirmed");
    if (s === BookingStatus.Pending) return t("profile.statusPending");
    if (s === BookingStatus.Completed) return t("profile.statusCompleted");
    return t("profile.statusCancelled");
  };

  const formatDate = (iso: string): string => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(dateLocale, { year: "numeric", month: "short", day: "numeric" })
        + " · " + d.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso.slice(0, 16).replace("T", " · ");
    }
  };

  const timeline = buildTimeline(booking);
  const today = new Date().toISOString().slice(0, 10);
  const canCancel = booking.status === BookingStatus.Confirmed && booking.date >= today;

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="bookings" />
            <div className="flex-1 min-w-0">
              <Link to="/perfil/reservas" className="inline-flex items-center gap-1 text-sm text-ocean mb-4 hover:underline">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
                {t("profile.backToBookings")}
              </Link>

              {/* Header card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <img
                    src={booking.tour.coverImageUrl ?? placeholderImage}
                    alt={booking.tour.title}
                    loading="lazy"
                    onError={onTourImageError}
                    className="w-full sm:w-48 h-32 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h1 className="text-lg md:text-xl font-bold text-charcoal">{booking.tour.title}</h1>
                      <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(booking.status)}`}>
                        {statusLabel(booking.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{booking.tour.providerName}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-calendar-line text-xs" /></div>
                        {booking.date}
                      </span>
                      {booking.startTime && (
                        <span className="flex items-center gap-1">
                          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-time-line text-xs" /></div>
                          {booking.startTime.slice(0, 5)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-user-line text-xs" /></div>
                        {booking.adults + booking.children} {t("profile.guests")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity timeline */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-6">
                <h2 className="text-base font-bold text-charcoal mb-5">{t("profile.activityLog")}</h2>
                <div className="relative pl-2">
                  {timeline.map((log, idx) => {
                    const isLast = idx === timeline.length - 1;
                    return (
                      <div key={log.event} className="relative flex gap-4 pb-5 last:pb-0">
                        {!isLast && (
                          <div className={`absolute left-[7px] top-5 w-px h-[calc(100%-12px)] ${log.done ? "bg-ocean/30" : "bg-gray-200"}`} />
                        )}
                        <div className="relative z-10 shrink-0 mt-0.5">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                              log.done ? "bg-ocean border-ocean" : "bg-white border-gray-300"
                            }`}
                          >
                            {log.done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 -mt-0.5">
                          <p className={`text-sm font-medium ${log.done ? "text-charcoal" : "text-gray-400"}`}>
                            {t(`profile.timeline.${log.event}`)}
                          </p>
                          {log.date && (
                            <p className="text-xs text-gray-400 mt-0.5">{formatDate(log.date)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking details */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-charcoal mb-4">{t("profile.bookingDetails")}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("profile.bookingId")}</span>
                      <span className="font-medium font-mono text-charcoal">{booking.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("profile.bookingDate")}</span>
                      <span className="font-medium text-charcoal">{booking.createdAt.slice(0, 10)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("profile.adults")}</span>
                      <span className="font-medium text-charcoal">{booking.adults}</span>
                    </div>
                    {booking.children > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("profile.children")}</span>
                        <span className="font-medium text-charcoal">{booking.children}</span>
                      </div>
                    )}
                    {booking.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("profile.discount", { defaultValue: "Descuento" })}</span>
                        <span className="font-medium text-charcoal">−${booking.discountAmount.toLocaleString(priceLocale)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-100 flex justify-between">
                      <span className="font-bold text-charcoal">{t("profile.total")}</span>
                      <span className="font-bold text-ocean">${booking.totalPrice.toLocaleString(priceLocale)} {booking.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Payment info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-charcoal mb-4">{t("profile.paymentInfo")}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("profile.paymentMethod")}</span>
                      <span className="font-medium text-charcoal">{paymentMethodLabel(booking)}</span>
                    </div>
                    {booking.payment?.providerPaymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("profile.paymentId")}</span>
                        <span className="font-medium font-mono text-charcoal text-xs">{booking.payment.providerPaymentId}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">{t("profile.providerContact")}</p>
                      <p className="text-sm text-gray-600">{booking.tour.providerName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to={`/voucher/${booking.id}`} className="inline-flex items-center gap-2 border border-gray-200 text-charcoal text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-file-list-line text-xs" /></div>
                  {t("profile.viewVoucher")}
                </Link>
                {canCancel && (
                  <Link to={`/perfil/reservas/${booking.id}/cancelar`} className="inline-flex items-center gap-2 border border-coral text-coral text-sm font-medium px-5 py-2.5 rounded-full hover:bg-coral/5 transition-colors">
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-close-line text-xs" /></div>
                    {t("profile.cancelBooking")}
                  </Link>
                )}
                {booking.status === BookingStatus.Completed && (
                  <Link to={`/perfil/reservas/${booking.id}/resena`} className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-ocean/90 transition-colors">
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-star-line text-xs" /></div>
                    {t("profile.leaveReview")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

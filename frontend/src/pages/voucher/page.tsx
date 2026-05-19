import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/lib/api";
import { BookingStatus, getBooking, PaymentStatus, type Booking } from "@/lib/bookings";

const placeholderImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop";

function paymentMethodLabel(b: Booking): string {
  if (!b.payment) return "—";
  return b.payment.provider === 0 ? "Mercado Pago" : "PayPal";
}

export default function VoucherPage() {
  const { t, i18n } = useTranslation("booking");
  const { bookingId } = useParams<{ bookingId: string }>();
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getBooking(bookingId)
      .then((b) => { if (!cancelled) setBooking(b); })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 403)) setNotFound(true);
        setBooking(null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [bookingId]);

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
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                <i className="ri-file-list-line text-3xl" />
              </div>
              <p className="text-sm text-gray-500 mb-4">{t("booking.voucherNotFound", { defaultValue: "No encontramos el voucher de esta reserva." })}</p>
              <Link to="/perfil/reservas" className="inline-flex bg-ocean text-white text-sm font-medium px-5 py-2 rounded-full">
                {t("booking.backToBookings", { defaultValue: "Volver a mis reservas" })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paid = booking.payment?.status === PaymentStatus.Approved;
  const badgeLabel = booking.status === BookingStatus.Cancelled
    ? t("booking.voucherCancelled", { defaultValue: "Cancelada" })
    : paid
      ? t("booking.voucherPaid")
      : t("booking.voucherPending", { defaultValue: "Pendiente" });
  const badgeClass = booking.status === BookingStatus.Cancelled
    ? "text-coral bg-coral/10"
    : paid
      ? "text-ocean bg-ocean/10"
      : "text-charcoal bg-sand/60";

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("booking.voucherTitle")}</h1>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 border border-gray-200 text-charcoal text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-50"
            >
              <i className="ri-printer-line" /> {t("booking.downloadPdf")}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-sailboat-line text-xl text-turquoise" />
                </div>
                <span className="font-display text-lg font-bold text-charcoal">Baja Tours</span>
              </div>
              <span className={`text-xs font-medium ${badgeClass} px-3 py-1 rounded-full`}>{badgeLabel}</span>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">{t("booking.bookingId")}</p>
              <p className="text-2xl font-bold font-mono text-charcoal">{booking.reference}</p>
            </div>

            <div className="flex gap-4">
              <img
                src={booking.tour.coverImageUrl ?? placeholderImage}
                alt={booking.tour.title}
                loading="lazy"
                className="w-28 h-24 object-cover rounded-xl shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-base font-bold text-charcoal mb-1">{booking.tour.title}</h2>
                <p className="text-sm text-gray-500 mb-1">{booking.tour.location}</p>
                <p className="text-sm text-gray-500">{booking.tour.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{t("booking.date")}</p>
                <p className="text-sm font-semibold text-charcoal">{booking.date}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{t("booking.time")}</p>
                <p className="text-sm font-semibold text-charcoal">{booking.startTime?.slice(0, 5) ?? "—"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{t("booking.guests")}</p>
                <p className="text-sm font-semibold text-charcoal">
                  {booking.adults} {t("booking.adults")}
                  {booking.children > 0 ? ` · ${booking.children} ${t("booking.children")}` : ""}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{t("booking.totalPaid")}</p>
                <p className="text-sm font-semibold text-ocean">
                  ${booking.totalPrice.toLocaleString(priceLocale)} {booking.currency}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-medium text-charcoal mb-2">{t("booking.providerContact")}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{booking.tour.providerName}</p>
                <p className="text-xs text-gray-400">{t("booking.paymentMethod", { defaultValue: "Método de pago" })}: {paymentMethodLabel(booking)}</p>
                {booking.payment?.providerPaymentId && (
                  <p className="text-xs font-mono text-gray-400">{booking.payment.providerPaymentId}</p>
                )}
              </div>
            </div>

            {booking.notes && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-charcoal mb-2">{t("booking.specialRequests", { defaultValue: "Notas" })}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{booking.notes}</p>
              </div>
            )}

            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
              <div className="w-32 h-32 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-2">
                <i className="ri-qr-code-line text-4xl text-gray-300" />
              </div>
              <p className="text-xs text-gray-500">{t("booking.showQr")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

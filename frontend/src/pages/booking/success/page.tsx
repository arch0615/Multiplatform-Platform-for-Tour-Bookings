import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { BookingStatus, getBooking, PaymentStatus, type Booking } from "@/lib/bookings";
import { ApiError } from "@/lib/api";

type View = "loading" | "approved" | "pending" | "rejected" | "error";

export default function BookingSuccessPage() {
  const { t, i18n } = useTranslation("booking");
  const [searchParams] = useSearchParams();
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  // Booking ID comes from query (`bookingId`) preferred, otherwise from external_reference
  const bookingId = searchParams.get("bookingId") ?? searchParams.get("external_reference");
  const collectionStatus = searchParams.get("collection_status");

  const [view, setView] = useState<View>("loading");
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setView("error");
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 4;

    const poll = async () => {
      try {
        const b = await getBooking(bookingId);
        if (cancelled) return;
        setBooking(b);
        if (b.status === BookingStatus.Confirmed
            || b.payment?.status === PaymentStatus.Approved) {
          setView("approved");
          return;
        }
        if (b.status === BookingStatus.Cancelled
            || b.payment?.status === PaymentStatus.Rejected) {
          setView("rejected");
          return;
        }
        // still pending — poll a few times in case the webhook is in flight
        attempts++;
        if (attempts < maxAttempts) setTimeout(poll, 1500);
        else setView("pending");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && (err.status === 401 || err.status === 403 || err.status === 404)) {
          setView("error");
        } else {
          setView("error");
        }
      }
    };

    poll();
    return () => { cancelled = true; };
    // collectionStatus included so a re-direct from /pago/procesando re-runs the polling
  }, [bookingId, collectionStatus]);

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-xl mx-auto">
          {view === "loading" && (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 border-4 border-ocean/20 border-t-ocean rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-2">{t("booking.verifyingTitle")}</h2>
              <p className="text-sm text-gray-500">{t("booking.verifyingDesc")}</p>
            </div>
          )}

          {view === "approved" && booking && (
            <ApprovedView booking={booking} t={t} priceLocale={priceLocale} />
          )}

          {view === "pending" && booking && (
            <PendingView booking={booking} t={t} priceLocale={priceLocale} />
          )}

          {view === "rejected" && booking && (
            <RejectedView booking={booking} t={t} priceLocale={priceLocale} />
          )}

          {view === "error" && (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                <i className="ri-error-warning-line text-4xl" />
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-2">{t("booking.loadError")}</h2>
              <Link
                to="/"
                className="inline-flex bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full mt-4"
              >
                {t("booking.backToHome")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type SectionProps = {
  booking: Booking;
  t: (k: string) => string;
  priceLocale: string;
};

function BookingCard({ booking, t, priceLocale }: SectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left">
      <div className="flex gap-4 mb-4">
        {booking.tour.coverImageUrl && (
          <img src={booking.tour.coverImageUrl} alt={booking.tour.title} className="w-24 h-20 object-cover rounded-xl shrink-0" />
        )}
        <div>
          <h3 className="text-base font-semibold text-charcoal">{booking.tour.title}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-map-pin-line text-xs" /></div>
            {booking.tour.location}
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">{t("booking.bookingId")}</span>
          <span className="font-medium text-charcoal">{booking.reference}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{t("booking.date")}</span>
          <span className="font-medium text-charcoal">{booking.date} {booking.startTime?.slice(0, 5) ?? ""}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{t("booking.totalGuests")}</span>
          <span className="font-medium text-charcoal">
            {booking.adults + booking.children}{" "}
            {booking.adults + booking.children === 1 ? t("booking.guest") : t("booking.guestsPlural")}
          </span>
        </div>
        {booking.payment?.providerPaymentId && (
          <div className="flex justify-between">
            <span className="text-gray-500">{t("booking.paymentId")}</span>
            <span className="font-medium text-charcoal">{booking.payment.providerPaymentId}</span>
          </div>
        )}
        <div className="pt-3 border-t border-gray-100 flex justify-between">
          <span className="font-bold text-charcoal">{t("booking.totalPaid")}</span>
          <span className="font-bold text-ocean text-lg">
            ${booking.totalPrice.toLocaleString(priceLocale)} {booking.currency}
          </span>
        </div>
      </div>
    </div>
  );
}

function ApprovedView({ booking, t, priceLocale }: SectionProps) {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 rounded-full bg-emerald-100">
        <i className="ri-check-line text-4xl text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">{t("booking.successTitle")}</h2>
      <p className="text-sm text-gray-500 mb-6">{t("booking.successDesc")}</p>

      <BookingCard booking={booking} t={t} priceLocale={priceLocale} />

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/perfil/reservas"
          className="inline-flex items-center justify-center gap-2 bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ocean/90 transition-colors"
        >
          {t("booking.viewBookings")}
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
        >
          {t("booking.backToHome")}
        </Link>
      </div>
    </div>
  );
}

function PendingView({ booking, t, priceLocale }: SectionProps) {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 rounded-full bg-amber-100">
        <i className="ri-time-line text-4xl text-amber-600" />
      </div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">{t("booking.pendingTitle")}</h2>
      <p className="text-sm text-gray-500 mb-6">{t("booking.pendingDesc")}</p>

      <BookingCard booking={booking} t={t} priceLocale={priceLocale} />

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/perfil/reservas"
          className="inline-flex items-center justify-center gap-2 bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ocean/90 transition-colors"
        >
          {t("booking.viewBookings")}
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
        >
          {t("booking.backToHome")}
        </Link>
      </div>
    </div>
  );
}

function RejectedView({ booking, t, priceLocale }: SectionProps) {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 rounded-full bg-red-100">
        <i className="ri-close-line text-4xl text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">{t("booking.rejectedTitle")}</h2>
      <p className="text-sm text-gray-500 mb-2">{t("booking.rejectedDesc")}</p>
      <p className="text-xs text-gray-400 mb-6">{t("booking.rejectedHelp")}</p>

      <BookingCard booking={booking} t={t} priceLocale={priceLocale} />

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to={`/booking/${booking.tour.slug}`}
          className="inline-flex items-center justify-center gap-2 bg-coral text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-coral/90 transition-colors"
        >
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-refresh-line" /></div>
          {t("booking.tryAgain")}
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
        >
          {t("booking.backToHome")}
        </Link>
      </div>
    </div>
  );
}

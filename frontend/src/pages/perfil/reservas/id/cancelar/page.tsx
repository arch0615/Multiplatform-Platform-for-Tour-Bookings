import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import ClientSidebar from "../../../components/ClientSidebar";
import { ApiError } from "@/lib/api";
import { BookingStatus, cancelBooking, getBooking, type Booking } from "@/lib/bookings";

const cancelReasons = [
  "cambio_fechas",
  "emergencia_personal",
  "mal_clima",
  "encontrar_mejor_precio",
  "doble_reserva",
  "otro",
];

export default function PerfilReservaCancelarPage() {
  const { t } = useTranslation("profile");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getBooking(id)
      .then((b) => { if (!cancelled) setBooking(b); })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 403)) setNotFound(true);
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

  const today = new Date().toISOString().slice(0, 10);
  const isCancellable = booking.status === BookingStatus.Pending
    || (booking.status === BookingStatus.Confirmed && booking.date >= today);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setSubmitting(true);
    setApiError(null);
    try {
      await cancelBooking(booking.id, reason, comment || undefined);
      setSubmitted(true);
      setTimeout(() => navigate("/perfil/reservas"), 1500);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setApiError(t("profile.cancelNotAllowed", { defaultValue: "Esta reserva ya no se puede cancelar." }));
      } else {
        setApiError(t("profile.cancelError", { defaultValue: "No pudimos cancelar la reserva. Inténtalo de nuevo." }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="bookings" />
            <div className="flex-1 min-w-0">
              <Link to={`/perfil/reservas/${id}`} className="inline-flex items-center gap-1 text-sm text-ocean mb-4 hover:underline">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
                {t("profile.backToBookingDetail")}
              </Link>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 max-w-lg">
                <h1 className="text-lg font-bold text-charcoal mb-1">{t("profile.cancelBooking")}</h1>
                <p className="text-sm text-gray-500 mb-1">
                  {booking.tour.title} &middot; {booking.date}{booking.startTime ? ` ${booking.startTime.slice(0, 5)}` : ""}
                </p>
                <p className="text-xs text-gray-400 font-mono mb-6">{booking.reference}</p>

                {!isCancellable ? (
                  <div className="bg-coral/10 border border-coral/30 text-coral text-sm rounded-xl p-4">
                    {t("profile.cancelNotAllowed", { defaultValue: "Esta reserva ya no se puede cancelar." })}
                    <div className="mt-3">
                      <Link to={`/perfil/reservas/${id}`} className="text-xs font-medium text-coral hover:underline">
                        {t("profile.backToBookingDetail")}
                      </Link>
                    </div>
                  </div>
                ) : submitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 flex items-center justify-center bg-sand/60 text-charcoal rounded-full mx-auto mb-3">
                      <i className="ri-check-line text-xl" />
                    </div>
                    <p className="text-sm font-medium text-charcoal">{t("profile.cancelSuccess")}</p>
                    <p className="text-xs text-gray-400 mt-1">{t("profile.redirecting")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {apiError && (
                      <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-3 py-2 rounded-lg mb-4">
                        {apiError}
                      </div>
                    )}

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-charcoal mb-2">{t("profile.cancelReason")}</label>
                      <div className="space-y-2">
                        {cancelReasons.map((r) => (
                          <label key={r} className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="radio"
                              name="cancel_reason"
                              value={r}
                              checked={reason === r}
                              onChange={() => setReason(r)}
                              className="accent-ocean"
                              required
                            />
                            <span className="text-sm text-gray-600 group-hover:text-charcoal">{t(`profile.cancelReasons.${r}`)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="cancel-comment" className="block text-sm font-medium text-charcoal mb-2">{t("profile.cancelComment")}</label>
                      <textarea
                        id="cancel-comment"
                        name="cancel_comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={500}
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-ocean resize-none"
                        placeholder={t("profile.cancelCommentPlaceholder")}
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-coral bg-coral/5 rounded-lg p-3 mb-5">
                      <div className="w-4 h-4 flex items-center justify-center shrink-0"><i className="ri-error-warning-line" /></div>
                      <span>{t("profile.cancelWarning")}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/perfil/reservas/${id}`)}
                        disabled={submitting}
                        className="inline-flex items-center justify-center border border-gray-200 text-charcoal text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {t("profile.goBack")}
                      </button>
                      <button
                        type="submit"
                        disabled={!reason || submitting}
                        className="inline-flex items-center justify-center bg-coral text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-coral/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap gap-2"
                      >
                        {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {t("profile.confirmCancel")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

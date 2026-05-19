import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import ClientSidebar from "../../../components/ClientSidebar";
import { ApiError } from "@/lib/api";
import { BookingStatus, getBooking, type Booking } from "@/lib/bookings";
import { submitBookingReview } from "@/lib/reviews";

export default function PerfilReservaResenaPage() {
  const { t } = useTranslation("profile");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
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

  const reviewable = booking.status === BookingStatus.Completed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !booking) return;
    setApiError(null);
    setSubmitting(true);
    try {
      await submitBookingReview(booking.id, {
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      });
      setSubmitted(true);
      setTimeout(() => navigate("/perfil/reservas"), 2000);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setApiError(err.message);
      } else if (err instanceof ApiError && err.status === 403) {
        setApiError(t("profile.reviewNotOwner", { defaultValue: "No puedes reseñar esta reserva." }));
      } else {
        setApiError(t("profile.reviewError", { defaultValue: "No pudimos enviar la reseña. Intenta de nuevo." }));
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
                <h1 className="text-lg font-bold text-charcoal mb-1">{t("profile.leaveReview")}</h1>
                <p className="text-sm text-gray-500 mb-1">
                  {booking.tour.title} &middot; {booking.date}
                </p>
                <p className="text-xs text-gray-400 font-mono mb-6">{booking.reference}</p>

                {!reviewable ? (
                  <div className="bg-sand/40 border border-sand text-charcoal text-sm rounded-xl p-4">
                    {t("profile.reviewOnlyCompleted", { defaultValue: "Solo puedes dejar una reseña después de que el tour haya finalizado." })}
                    <div className="mt-3">
                      <Link to={`/perfil/reservas/${id}`} className="text-xs font-medium text-ocean hover:underline">
                        {t("profile.backToBookingDetail")}
                      </Link>
                    </div>
                  </div>
                ) : submitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 flex items-center justify-center bg-sand/60 text-charcoal rounded-full mx-auto mb-3">
                      <i className="ri-check-line text-xl" />
                    </div>
                    <p className="text-sm font-medium text-charcoal">{t("profile.reviewSuccess")}</p>
                    <p className="text-xs text-gray-400 mt-1">{t("profile.redirecting")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    {apiError && (
                      <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-3 py-2 rounded-lg mb-4">
                        {apiError}
                      </div>
                    )}

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-charcoal mb-2">{t("profile.yourRating")}</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="w-10 h-10 flex items-center justify-center text-2xl transition-colors focus:outline-none"
                          >
                            <i
                              className={
                                star <= (hoverRating || rating)
                                  ? "ri-star-fill text-coral"
                                  : "ri-star-line text-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="review-title" className="block text-sm font-medium text-charcoal mb-2">
                        {t("profile.reviewTitle", { defaultValue: "Título (opcional)" })}
                      </label>
                      <input
                        id="review-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={120}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-ocean"
                      />
                    </div>

                    <div className="mb-5">
                      <label htmlFor="review-comment" className="block text-sm font-medium text-charcoal mb-2">{t("profile.reviewComment")}</label>
                      <textarea
                        id="review-comment"
                        name="review_comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={2000}
                        rows={5}
                        required
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-ocean resize-none"
                        placeholder={t("profile.reviewCommentPlaceholder")}
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/2000</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/perfil/reservas/${id}`)}
                        disabled={submitting}
                        className="inline-flex items-center justify-center border border-gray-200 text-charcoal text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-50"
                      >
                        {t("profile.goBack")}
                      </button>
                      <button
                        type="submit"
                        disabled={rating === 0 || comment.trim().length === 0 || submitting}
                        className="inline-flex items-center justify-center gap-2 bg-ocean text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-ocean/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {t("profile.sendReview")}
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

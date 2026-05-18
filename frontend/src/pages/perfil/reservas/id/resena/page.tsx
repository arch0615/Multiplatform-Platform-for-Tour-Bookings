import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useNavigate } from "react-router-dom";
import ClientSidebar from "../../../components/ClientSidebar";

const mockBookings = [
  { id: "BK-001", tourTitle: "Snorkel con tiburón ballena", date: "2026-05-20", provider: "EcoPaz Tours" },
  { id: "BK-002", tourTitle: "Tour gastronómico La Paz", date: "2026-04-15", provider: "La Paz Gastro" },
  { id: "BK-003", tourTitle: "City tour histórico", date: "2026-06-10", provider: "EcoPaz Tours" },
  { id: "BK-004", tourTitle: "Paseo en kayak bioluminiscente", date: "2026-03-10", provider: "Baja Aventuras" },
];

export default function PerfilReservaResenaPage() {
  const { t } = useTranslation("profile");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => navigate("/perfil/reservas"), 2000);
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
                <p className="text-sm text-gray-500 mb-6">
                  {booking.tourTitle} &middot; {booking.date}
                </p>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 flex items-center justify-center bg-sand/60 text-charcoal rounded-full mx-auto mb-3">
                      <i className="ri-check-line text-xl" />
                    </div>
                    <p className="text-sm font-medium text-charcoal">{t("profile.reviewSuccess")}</p>
                    <p className="text-xs text-gray-400 mt-1">{t("profile.redirecting")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} data-readdy-form>
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
                      <label htmlFor="review-comment" className="block text-sm font-medium text-charcoal mb-2">{t("profile.reviewComment")}</label>
                      <textarea
                        id="review-comment"
                        name="review_comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={500}
                        rows={4}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-ocean resize-none"
                        placeholder={t("profile.reviewCommentPlaceholder")}
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/perfil/reservas/${id}`)}
                        className="inline-flex items-center justify-center border border-gray-200 text-charcoal text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        {t("profile.goBack")}
                      </button>
                      <button
                        type="submit"
                        disabled={rating === 0}
                        className="inline-flex items-center justify-center bg-ocean text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-ocean/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
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
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import ClientSidebar from "../../components/ClientSidebar";
import { tours } from "@/mocks/tours";

const mockBookings = [
  {
    id: "BK-001",
    tourId: 1,
    tourTitle: "Snorkel con tiburón ballena",
    date: "2026-05-20",
    time: "09:00",
    adults: 2,
    children: 1,
    total: 5400,
    status: "confirmed",
    image: tours[0].image,
    provider: "EcoPaz Tours",
    providerPhone: "+52 612 123 4567",
    providerEmail: "hola@ecopaz.mx",
    bookingDate: "2026-04-15",
    paymentMethod: "Tarjeta ···4242",
    paymentId: "MP-12345678",
    activityLog: [
      { event: "booking_created", date: "2026-04-15 10:30", done: true },
      { event: "payment_received", date: "2026-04-15 10:35", done: true },
      { event: "booking_confirmed", date: "2026-04-15 10:36", done: true },
      { event: "reminder_sent", date: "2026-05-18 09:00", done: false },
      { event: "tour_completed", date: "2026-05-20 12:00", done: false },
    ],
  },
  {
    id: "BK-002",
    tourId: 3,
    tourTitle: "Tour gastronómico La Paz",
    date: "2026-04-15",
    time: "18:00",
    adults: 2,
    children: 0,
    total: 2400,
    status: "completed",
    image: tours[2].image,
    provider: "La Paz Gastro",
    providerPhone: "+52 612 234 5678",
    providerEmail: "contacto@lapazgastro.mx",
    bookingDate: "2026-03-20",
    paymentMethod: "OXXO",
    paymentId: "MP-87654321",
    activityLog: [
      { event: "booking_created", date: "2026-03-20 14:00", done: true },
      { event: "payment_received", date: "2026-03-20 16:20", done: true },
      { event: "booking_confirmed", date: "2026-03-20 16:21", done: true },
      { event: "reminder_sent", date: "2026-04-13 09:00", done: true },
      { event: "tour_completed", date: "2026-04-15 21:00", done: true },
      { event: "review_requested", date: "2026-04-16 10:00", done: true },
    ],
  },
  {
    id: "BK-003",
    tourId: 5,
    tourTitle: "City tour histórico",
    date: "2026-06-10",
    time: "10:00",
    adults: 1,
    children: 0,
    total: 800,
    status: "pending",
    image: tours[4].image,
    provider: "EcoPaz Tours",
    providerPhone: "+52 612 123 4567",
    providerEmail: "hola@ecopaz.mx",
    bookingDate: "2026-05-01",
    paymentMethod: "SPEI",
    paymentId: "MP-11223344",
    activityLog: [
      { event: "booking_created", date: "2026-05-01 11:00", done: true },
      { event: "payment_received", date: "", done: false },
      { event: "booking_confirmed", date: "", done: false },
      { event: "reminder_sent", date: "", done: false },
      { event: "tour_completed", date: "", done: false },
    ],
  },
  {
    id: "BK-004",
    tourId: 2,
    tourTitle: "Paseo en kayak bioluminiscente",
    date: "2026-03-10",
    time: "20:00",
    adults: 2,
    children: 0,
    total: 3000,
    status: "cancelled",
    image: tours[1].image,
    provider: "Baja Aventuras",
    providerPhone: "+52 612 345 6789",
    providerEmail: "info@bajaaventuras.com",
    bookingDate: "2026-02-28",
    paymentMethod: "Tarjeta ···8888",
    paymentId: "MP-44332211",
    activityLog: [
      { event: "booking_created", date: "2026-02-28 09:15", done: true },
      { event: "payment_received", date: "2026-02-28 09:20", done: true },
      { event: "booking_confirmed", date: "2026-02-28 09:21", done: true },
      { event: "reminder_sent", date: "2026-03-08 09:00", done: true },
      { event: "booking_cancelled", date: "2026-03-09 16:45", done: true },
      { event: "refund_processed", date: "2026-03-10 08:00", done: true },
    ],
  },
];

export default function PerfilReservaDetallePage() {
  const { t, i18n } = useTranslation("profile");
  const { id } = useParams<{ id: string }>();
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

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

  const formatTimelineDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [d, time] = dateStr.split(" ");
    return `${d} · ${time}`;
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="bookings" />
            <div className="flex-1 min-w-0">
              {/* Back link */}
              <Link to="/perfil/reservas" className="inline-flex items-center gap-1 text-sm text-ocean mb-4 hover:underline">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
                {t("profile.backToBookings")}
              </Link>

              {/* Header card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <img src={booking.image} alt={booking.tourTitle} className="w-full sm:w-48 h-32 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h1 className="text-lg md:text-xl font-bold text-charcoal">{booking.tourTitle}</h1>
                      <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(booking.status)}`}>
                        {statusLabel(booking.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{booking.provider}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-calendar-line text-xs" /></div>
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-time-line text-xs" /></div>
                        {booking.time}
                      </span>
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
                  {booking.activityLog.map((log, idx) => {
                    const isLast = idx === booking.activityLog.length - 1;
                    const isDone = log.done;
                    return (
                      <div key={log.event} className="relative flex gap-4 pb-5 last:pb-0">
                        {/* Line */}
                        {!isLast && (
                          <div className={`absolute left-[7px] top-5 w-px h-[calc(100%-12px)] ${isDone ? "bg-ocean/30" : "bg-gray-200"}`} />
                        )}
                        {/* Dot */}
                        <div className="relative z-10 shrink-0 mt-0.5">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                              isDone
                                ? "bg-ocean border-ocean"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            {isDone && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0 -mt-0.5">
                          <p className={`text-sm font-medium ${isDone ? "text-charcoal" : "text-gray-400"}`}>
                            {t(`profile.timeline.${log.event}`)}
                          </p>
                          {log.date && (
                            <p className="text-xs text-gray-400 mt-0.5">{formatTimelineDate(log.date)}</p>
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
                      <span className="font-medium font-mono text-charcoal">{booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("profile.bookingDate")}</span>
                      <span className="font-medium text-charcoal">{booking.bookingDate}</span>
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
                    <div className="pt-2 border-t border-gray-100 flex justify-between">
                      <span className="font-bold text-charcoal">{t("profile.total")}</span>
                      <span className="font-bold text-ocean">${booking.total.toLocaleString(priceLocale)} MXN</span>
                    </div>
                  </div>
                </div>

                {/* Payment info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-base font-bold text-charcoal mb-4">{t("profile.paymentInfo")}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("profile.paymentMethod")}</span>
                      <span className="font-medium text-charcoal">{booking.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("profile.paymentId")}</span>
                      <span className="font-medium font-mono text-charcoal">{booking.paymentId}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">{t("profile.providerContact")}</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-1"><i className="ri-phone-line text-xs" /> {booking.providerPhone}</p>
                        <p className="flex items-center gap-1"><i className="ri-mail-line text-xs" /> {booking.providerEmail}</p>
                      </div>
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
                {booking.status === "confirmed" && (
                  <Link to={`/perfil/reservas/${booking.id}/cancelar`} className="inline-flex items-center gap-2 border border-coral text-coral text-sm font-medium px-5 py-2.5 rounded-full hover:bg-coral/5 transition-colors">
                    <div className="w-4 h-4 flex items-center justify-center"><i className="ri-close-line text-xs" /></div>
                    {t("profile.cancelBooking")}
                  </Link>
                )}
                {booking.status === "completed" && (
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
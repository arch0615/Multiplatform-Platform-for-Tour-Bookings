import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { tours } from "@/mocks/tours";
import { onTourImageError } from "@/lib/imageFallback";

export default function ReservarConfirmacionPage() {
  const { t } = useTranslation("booking");
  const { bookingId } = useParams<{ bookingId: string }>();
  const tour = tours[0];

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto text-center pt-8">
          <div className="w-20 h-20 flex items-center justify-center bg-ocean/10 rounded-full mx-auto mb-6">
            <i className="ri-checkbox-circle-line text-4xl text-ocean" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">{t("booking.confirmTitle")}</h1>
          <p className="text-sm text-gray-500 mb-8">{t("booking.confirmDesc")}</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 text-left mb-6">
            <h2 className="text-base font-bold text-charcoal mb-4">{t("booking.orderDetails")}</h2>
            <div className="flex gap-4 mb-4">
              <img src={tour.image} alt={tour.title} onError={onTourImageError} className="w-24 h-20 object-cover rounded-xl shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-charcoal">{tour.title}</h3>
                <p className="text-xs text-gray-500">{tour.location}</p>
                <p className="text-xs text-gray-500">{tour.duration}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">{t("booking.bookingId")}</span><span className="font-medium font-mono">{bookingId}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t("booking.date")}</span><span className="font-medium">2026-05-20</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t("booking.time")}</span><span className="font-medium">09:00</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t("booking.guests")}</span><span className="font-medium">2 adults</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t("booking.paymentId")}</span><span className="font-medium font-mono">MP-12345678</span></div>
              <div className="pt-2 border-t border-gray-100 flex justify-between">
                <span className="font-bold text-charcoal">{t("booking.totalPaid")}</span>
                <span className="font-bold text-ocean">$6,264 MXN</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/voucher/${bookingId}`} className="inline-flex items-center justify-center gap-2 bg-ocean text-white font-medium px-6 py-3 rounded-full">
              <i className="ri-file-list-line" /> {t("booking.viewVoucher")}
            </Link>
            <Link to="/perfil/reservas" className="inline-flex items-center justify-center gap-2 border border-gray-200 text-charcoal font-medium px-6 py-3 rounded-full hover:bg-gray-50">
              <i className="ri-calendar-line" /> {t("booking.myBookings")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
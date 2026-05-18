import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

export default function PagoFallidoPage() {
  const { t } = useTranslation("booking");
  const { bookingId } = useParams<{ bookingId: string }>();

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto text-center pt-8">
          <div className="w-20 h-20 flex items-center justify-center bg-coral/10 rounded-full mx-auto mb-6">
            <i className="ri-close-circle-line text-4xl text-coral" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">{t("booking.failedTitle")}</h1>
          <p className="text-sm text-gray-500 mb-8">{t("booking.failedDesc")}</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 text-left mb-6">
            <h2 className="text-base font-bold text-charcoal mb-4">{t("booking.whatHappened")}</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><i className="ri-error-warning-line text-coral mt-0.5" /> {t("booking.failReason1")}</li>
              <li className="flex items-start gap-2"><i className="ri-error-warning-line text-coral mt-0.5" /> {t("booking.failReason2")}</li>
              <li className="flex items-start gap-2"><i className="ri-error-warning-line text-coral mt-0.5" /> {t("booking.failReason3")}</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/reservar/1/pago`} className="inline-flex items-center justify-center gap-2 bg-ocean text-white font-medium px-6 py-3 rounded-full">
              <i className="ri-refresh-line" /> {t("booking.tryAgain")}
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
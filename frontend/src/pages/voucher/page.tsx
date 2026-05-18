import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { tours } from "@/mocks/tours";

export default function VoucherPage() {
  const { t } = useTranslation("booking");
  const { bookingId } = useParams<{ bookingId: string }>();
  const tour = tours[0];

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("booking.voucherTitle")}</h1>
            <button className="inline-flex items-center gap-2 border border-gray-200 text-charcoal text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-50">
              <i className="ri-download-line" /> {t("booking.downloadPdf")}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center"><i className="ri-sailboat-line text-xl text-turquoise" /></div>
                <span className="font-display text-lg font-bold text-charcoal">Baja Tours</span>
              </div>
              <span className="text-xs font-medium text-ocean bg-ocean/10 px-3 py-1 rounded-full">{t("booking.voucherPaid")}</span>
            </div>

            {/* Booking ID */}
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">{t("booking.bookingId")}</p>
              <p className="text-2xl font-bold font-mono text-charcoal">{bookingId}</p>
            </div>

            {/* Tour info */}
            <div className="flex gap-4">
              <img src={tour.image} alt={tour.title} className="w-28 h-24 object-cover rounded-xl shrink-0" />
              <div>
                <h2 className="text-base font-bold text-charcoal mb-1">{tour.title}</h2>
                <p className="text-sm text-gray-500 mb-1">{tour.location}</p>
                <p className="text-sm text-gray-500">{tour.duration}</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{t("booking.date")}</p>
                <p className="text-sm font-semibold text-charcoal">2026-05-20</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{t("booking.time")}</p>
                <p className="text-sm font-semibold text-charcoal">09:00</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{t("booking.guests")}</p>
                <p className="text-sm font-semibold text-charcoal">2 {t("booking.adults")}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{t("booking.totalPaid")}</p>
                <p className="text-sm font-semibold text-ocean">$6,264 MXN</p>
              </div>
            </div>

            {/* Contact */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-medium text-charcoal mb-2">{t("booking.providerContact")}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>EcoPaz Tours</p>
                <p>hola@ecopaz.mx</p>
                <p>+52 612 123 4567</p>
              </div>
            </div>

            {/* QR placeholder */}
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
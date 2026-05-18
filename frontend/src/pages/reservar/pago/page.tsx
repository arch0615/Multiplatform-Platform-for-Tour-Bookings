import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { tours } from "@/mocks/tours";

export default function ReservarPagoPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const { t, i18n } = useTranslation("booking");
  const navigate = useNavigate();
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const tour = useMemo(() => tours.find((t) => String(t.id) === tourId), [tourId]);

  // In production these would come from the previous booking details step
  const [date] = useState("2026-05-20");
  const [time] = useState("09:00");
  const [adults] = useState(2);
  const [children] = useState(0);
  const [processing, setProcessing] = useState(false);

  const childPrice = tour ? Math.round(tour.price * 0.6) : 0;
  const adultsTotal = tour ? adults * tour.price : 0;
  const childrenTotal = tour ? children * childPrice : 0;
  const subtotal = adultsTotal + childrenTotal;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + tax;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      navigate("/pago/procesando");
    }, 1000);
  };

  if (!tour) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-charcoal mb-2">{t("booking.notFound")}</h1>
          <Link to="/tours" className="inline-flex bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full">{t("booking.backToTours")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 pt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-1">{t("booking.paymentTitle")}</h1>
            <p className="text-sm text-gray-500">{t("booking.paymentSubtitle")}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Payment form */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                    <i className="ri-secure-payment-line text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-charcoal">{t("booking.mpTitle")}</h2>
                    <p className="text-xs text-gray-500">{t("booking.mpDesc")}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">{t("booking.mpAccepted")}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: "ri-bank-card-line", label: t("booking.mpCard"), color: "text-ocean" },
                      { icon: "ri-store-line", label: t("booking.mpOxxo"), color: "text-coral" },
                      { icon: "ri-exchange-dollar-line", label: t("booking.mpSpei"), color: "text-turquoise" },
                    ].map((m) => (
                      <div key={m.label} className="flex flex-col items-center gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50">
                        <div className={`w-8 h-8 flex items-center justify-center ${m.color}`}><i className={`${m.icon} text-xl`} /></div>
                        <span className="text-xs text-center text-gray-600 leading-tight">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order summary */}
                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{tour.title}</span>
                    <span className="font-medium text-charcoal">{date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{adults + children} {t("booking.guests")}</span>
                    <span className="font-medium text-charcoal">{time}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between">
                    <span className="font-bold text-charcoal">{t("booking.total")}</span>
                    <span className="font-bold text-ocean">${total.toLocaleString(priceLocale)} MXN</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <div className="w-4 h-4 flex items-center justify-center text-ocean shrink-0 mt-0.5"><i className="ri-shield-check-line" /></div>
                  {t("booking.mpSecure")}
                </div>

                <div className="flex gap-3">
                  <Link to={`/reservar/${tourId}`} className="flex-1 text-center border border-gray-200 text-charcoal font-medium py-3 rounded-full hover:bg-gray-50 transition-colors">
                    {t("booking.back")}
                  </Link>
                  <button
                    onClick={handlePay}
                    disabled={processing}
                    className="flex-1 bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-full transition-colors disabled:opacity-70 inline-flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("booking.processing")}</>
                    ) : (
                      <><i className="ri-arrow-right-line" />{t("booking.mpPayButton")}</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div className="lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h3 className="text-base font-bold text-charcoal mb-4">{t("booking.priceSummary")}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">{t("booking.adultsTotal")} ({adults})</span><span className="font-medium">${adultsTotal.toLocaleString(priceLocale)}</span></div>
                  {children > 0 && <div className="flex justify-between"><span className="text-gray-500">{t("booking.childrenTotal")} ({children})</span><span className="font-medium">${childrenTotal.toLocaleString(priceLocale)}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">{t("booking.subtotal")}</span><span className="font-medium">${subtotal.toLocaleString(priceLocale)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">{t("booking.taxes")}</span><span className="font-medium">${tax.toLocaleString(priceLocale)}</span></div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between">
                    <span className="font-bold text-charcoal">{t("booking.total")}</span>
                    <span className="font-bold text-ocean text-lg">${total.toLocaleString(priceLocale)} MXN</span>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500"><i className="ri-checkbox-circle-line text-ocean" />{t("booking.instantConfirm")}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><i className="ri-checkbox-circle-line text-ocean" />{t("booking.freeCancel")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
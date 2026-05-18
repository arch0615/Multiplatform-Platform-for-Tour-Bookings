import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { tours } from "@/mocks/tours";

export default function BookingSuccessPage() {
  const { t, i18n } = useTranslation("booking");
  const [searchParams] = useSearchParams();
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [verifying, setVerifying] = useState(true);

  // Read Mercado Pago URL params
  const collectionStatus = searchParams.get("collection_status");
  const paymentId = searchParams.get("payment_id") ?? searchParams.get("collection_id");
  const externalRef = searchParams.get("external_reference");
  const merchantOrderId = searchParams.get("merchant_order_id");

  // Parse mock order data from external_reference if available
  // Expected format: BK-{tourId}-{date}-{time}-{adults}-{children}
  const parsed = useMemo(() => {
    if (!externalRef) return null;
    const parts = externalRef.split("-");
    if (parts.length >= 2) {
      const tourId = Number(parts[1]);
      const tour = tours.find((t) => t.id === tourId);
      return {
        tour,
        date: parts[2] || "",
        time: parts[3] || "",
        adults: Number(parts[4]) || 1,
        children: Number(parts[5]) || 0,
        total: tour
          ? (Number(parts[4]) || 1) * tour.price +
            (Number(parts[5]) || 0) * Math.round(tour.price * 0.6) +
            Math.round(
              ((Number(parts[4]) || 1) * tour.price +
                (Number(parts[5]) || 0) * Math.round(tour.price * 0.6)) *
                0.16
            )
          : 0,
      };
    }
    return null;
  }, [externalRef]);

  useEffect(() => {
    const timer = setTimeout(() => setVerifying(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const isApproved = collectionStatus === "approved";
  const isPending = collectionStatus === "pending" || collectionStatus === "in_process";
  const isRejected =
    collectionStatus === "rejected" || (!isApproved && !isPending && !verifying);

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-xl mx-auto">
          {/* Verifying */}
          {verifying && (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 border-4 border-ocean/20 border-t-ocean rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-2">
                {t("booking.verifyingTitle")}
              </h2>
              <p className="text-sm text-gray-500">{t("booking.verifyingDesc")}</p>
            </div>
          )}

          {/* Approved */}
          {!verifying && isApproved && (
            <div className="text-center py-6">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 rounded-full bg-emerald-100">
                <i className="ri-check-line text-4xl text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-2">
                {t("booking.successTitle")}
              </h2>
              <p className="text-sm text-gray-500 mb-6">{t("booking.successDesc")}</p>

              {parsed?.tour && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={parsed.tour.image}
                      alt={parsed.tour.title}
                      className="w-24 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-charcoal">
                        {parsed.tour.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-map-pin-line text-xs" />
                        </div>
                        {parsed.tour.location}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.bookingId")}</span>
                      <span className="font-medium text-charcoal">{externalRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.date")}</span>
                      <span className="font-medium text-charcoal">
                        {parsed.date} {parsed.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.totalGuests")}</span>
                      <span className="font-medium text-charcoal">
                        {parsed.adults + parsed.children}{" "}
                        {parsed.adults + parsed.children === 1
                          ? t("booking.guest")
                          : t("booking.guestsPlural")}
                      </span>
                    </div>
                    {paymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("booking.paymentId")}</span>
                        <span className="font-medium text-charcoal">{paymentId}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-100 flex justify-between">
                      <span className="font-bold text-charcoal">{t("booking.totalPaid")}</span>
                      <span className="font-bold text-ocean text-lg">
                        ${parsed.total.toLocaleString(priceLocale)} MXN
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!parsed && externalRef && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.bookingId")}</span>
                      <span className="font-medium text-charcoal">{externalRef}</span>
                    </div>
                    {paymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("booking.paymentId")}</span>
                        <span className="font-medium text-charcoal">{paymentId}</span>
                      </div>
                    )}
                    {merchantOrderId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("booking.merchantOrderId")}</span>
                        <span className="font-medium text-charcoal">{merchantOrderId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/profile"
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
          )}

          {/* Pending */}
          {!verifying && isPending && (
            <div className="text-center py-6">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 rounded-full bg-amber-100">
                <i className="ri-time-line text-4xl text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-2">
                {t("booking.pendingTitle")}
              </h2>
              <p className="text-sm text-gray-500 mb-6">{t("booking.pendingDesc")}</p>

              {parsed?.tour && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={parsed.tour.image}
                      alt={parsed.tour.title}
                      className="w-24 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-charcoal">
                        {parsed.tour.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-map-pin-line text-xs" />
                        </div>
                        {parsed.tour.location}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.bookingId")}</span>
                      <span className="font-medium text-charcoal">{externalRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.totalGuests")}</span>
                      <span className="font-medium text-charcoal">
                        {parsed.adults + parsed.children}{" "}
                        {parsed.adults + parsed.children === 1
                          ? t("booking.guest")
                          : t("booking.guestsPlural")}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between">
                      <span className="font-bold text-charcoal">{t("booking.total")}</span>
                      <span className="font-bold text-ocean text-lg">
                        ${parsed.total.toLocaleString(priceLocale)} MXN
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/profile"
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
          )}

          {/* Rejected / Error */}
          {!verifying && isRejected && (
            <div className="text-center py-6">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 rounded-full bg-red-100">
                <i className="ri-close-line text-4xl text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-2">
                {t("booking.rejectedTitle")}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{t("booking.rejectedDesc")}</p>
              <p className="text-xs text-gray-400 mb-6">{t("booking.rejectedHelp")}</p>

              {parsed?.tour && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={parsed.tour.image}
                      alt={parsed.tour.title}
                      className="w-24 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-charcoal">
                        {parsed.tour.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-map-pin-line text-xs" />
                        </div>
                        {parsed.tour.location}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.bookingId")}</span>
                      <span className="font-medium text-charcoal">{externalRef}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between">
                      <span className="font-bold text-charcoal">{t("booking.total")}</span>
                      <span className="font-bold text-ocean text-lg">
                        ${parsed.total.toLocaleString(priceLocale)} MXN
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center gap-2 bg-coral text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-coral/90 transition-colors"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-refresh-line" />
                  </div>
                  {t("booking.tryAgain")}
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {t("booking.backToHome")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface BookingFormProps {
  slug: string;
  price: number;
  childPrice: number | null;
  maxGuests: number;
  priceLocale: string;
}

export default function BookingForm({ slug, price, childPrice, maxGuests, priceLocale }: BookingFormProps) {
  const { t } = useTranslation("tour");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [date, setDate] = useState("");

  const total = useMemo(() => {
    let sum = adults * price;
    if (childPrice) sum += children * childPrice;
    return sum;
  }, [adults, children, price, childPrice]);

  const maxAdults = Math.max(1, maxGuests - children);
  const maxChildren = childPrice ? Math.max(0, maxGuests - adults) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 sticky top-24">
      <div className="flex items-baseline gap-2 mb-5">
        <span className="text-2xl md:text-3xl font-bold text-ocean">
          ${total.toLocaleString(priceLocale)}
        </span>
        <span className="text-sm text-gray-500">MXN</span>
      </div>

      <div className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.date")}</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
              <i className="ri-calendar-line" />
            </div>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-ocean transition-colors bg-white"
            />
          </div>
        </div>

        {/* Adults */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.adults")}</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdults((a) => Math.max(1, a - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-charcoal hover:border-ocean hover:text-ocean transition-colors"
            >
              <i className="ri-subtract-line" />
            </button>
            <span className="text-sm font-semibold text-charcoal w-8 text-center">{adults}</span>
            <button
              onClick={() => setAdults((a) => Math.min(maxAdults, a + 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-charcoal hover:border-ocean hover:text-ocean transition-colors"
            >
              <i className="ri-add-line" />
            </button>
          </div>
        </div>

        {/* Children */}
        {childPrice !== null && (
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.children")}</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setChildren((c) => Math.max(0, c - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-charcoal hover:border-ocean hover:text-ocean transition-colors"
              >
                <i className="ri-subtract-line" />
              </button>
              <span className="text-sm font-semibold text-charcoal w-8 text-center">{children}</span>
              <button
                onClick={() => setChildren((c) => Math.min(maxChildren, c + 1))}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-charcoal hover:border-ocean hover:text-ocean transition-colors"
              >
                <i className="ri-add-line" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ${childPrice.toLocaleString(priceLocale)} MXN {t("perPerson")}
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">{adults} {t("booking.adults")}</span>
            <span className="font-medium text-charcoal">
              ${(adults * price).toLocaleString(priceLocale)} MXN
            </span>
          </div>
          {childPrice !== null && children > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">{children} {t("booking.children")}</span>
              <span className="font-medium text-charcoal">
                ${(children * childPrice).toLocaleString(priceLocale)} MXN
              </span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-charcoal mt-2 pt-2 border-t border-gray-100">
            <span>{t("booking.total")}</span>
            <span>${total.toLocaleString(priceLocale)} MXN</span>
          </div>
        </div>

        <Link
          to={`/booking/${slug}`}
          className="w-full block text-center bg-coral hover:bg-coral/90 text-white font-semibold py-3 rounded-xl transition-colors whitespace-nowrap"
        >
          {t("bookNow")}
        </Link>

        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-4 h-4 flex items-center justify-center text-ocean">
              <i className="ri-check-line" />
            </div>
            {t("booking.instantConfirmation")}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-4 h-4 flex items-center justify-center text-ocean">
              <i className="ri-check-line" />
            </div>
            {t("booking.freeCancellation")}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-4 h-4 flex items-center justify-center text-ocean">
              <i className="ri-check-line" />
            </div>
            {t("booking.mobileTicket")}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-4 h-4 flex items-center justify-center text-ocean">
              <i className="ri-check-line" />
            </div>
            {t("booking.lowestPrice")}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { tours } from "@/mocks/tours";

export default function BookingPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const { t, i18n } = useTranslation("booking");
  const navigate = useNavigate();
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const tour = useMemo(() => tours.find((t) => String(t.id) === tourId), [tourId]);

  const [step, setStep] = useState(1);
  const [date, setDate] = useState("2026-05-20");
  const [time, setTime] = useState("09:00");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requests, setRequests] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>();
  const [processing, setProcessing] = useState(false);

  const childPrice = tour ? Math.round(tour.price * 0.6) : 0;
  const adultsTotal = tour ? adults * tour.price : 0;
  const childrenTotal = tour ? children * childPrice : 0;
  const subtotal = adultsTotal + childrenTotal;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + tax;

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!date) e.date = t("booking.required");
    if (adults + children === 0) e.guests = t("booking.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = t("booking.required");
    if (!lastName.trim()) e.lastName = t("booking.required");
    if (!email.trim()) e.email = t("booking.required");
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = t("booking.invalidEmail");
    if (!phone.trim()) e.phone = t("booking.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleConfirm = () => {
    setProcessing(true);
    // Build an external reference that the success page can parse back
    const ref = `BK-${tour!.id}-${date}-${time}-${adults}-${children}`;
    // In production, this calls an edge function to create a Mercado Pago preference,
    // then redirects the user to Mercado Pago's checkout page. After payment, Mercado Pago
    // redirects back to /booking/success with collection_status, payment_id, etc.
    setTimeout(() => {
      setProcessing(false);
      navigate(
        `/booking/success?collection_status=approved&external_reference=${encodeURIComponent(ref)}&payment_id=MP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
      );
    }, 1500);
  };

  if (!tour) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
            <i className="ri-map-pin-line text-4xl" />
          </div>
          <h1 className="text-xl font-bold text-charcoal mb-2">{t("booking.notFound")}</h1>
          <Link to="/tours" className="inline-flex bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full">
            {t("booking.backToTours")}
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: t("booking.step1") },
    { num: 2, label: t("booking.step2") },
    { num: 3, label: t("booking.step3") },
  ];

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-1">{t("booking.title")}</h1>
            <p className="text-sm text-gray-500">{t("booking.subtitle")}</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2 md:gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      step >= s.num ? "bg-ocean text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step > s.num ? <i className="ri-check-line" /> : s.num}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium hidden md:block ${step >= s.num ? "text-ocean" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-px transition-colors ${step > s.num ? "bg-ocean" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {step <= 3 && (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Main form */}
              <div className="flex-1 min-w-0">
                {step === 1 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 space-y-5">
                    <h2 className="text-lg font-bold text-charcoal">{t("booking.tourSummary")}</h2>

                    <div className="flex gap-4">
                      <img src={tour.image} alt={tour.title} className="w-24 h-20 object-cover rounded-xl shrink-0" />
                      <div>
                        <h3 className="text-base font-semibold text-charcoal">{tour.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-map-pin-line text-xs" /></div>
                          {tour.location}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-time-line text-xs" /></div>
                          {tour.duration}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.date")}</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        />
                        {errors?.date && <p className="text-xs text-coral mt-1">{errors.date}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.time")}</label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-3">{t("booking.guests")}</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2.5">
                          <div>
                            <p className="text-sm font-medium text-charcoal">{t("booking.adults")}</p>
                            <p className="text-xs text-gray-400">${tour.price.toLocaleString(priceLocale)} {t("booking.perPerson")}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setAdults(Math.max(0, adults - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                              <i className="ri-subtract-line" />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{adults}</span>
                            <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                              <i className="ri-add-line" />
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2.5">
                          <div>
                            <p className="text-sm font-medium text-charcoal">{t("booking.children")}</p>
                            <p className="text-xs text-gray-400">${childPrice.toLocaleString(priceLocale)} {t("booking.perChild")}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                              <i className="ri-subtract-line" />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{children}</span>
                            <button onClick={() => setChildren(children + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                              <i className="ri-add-line" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {errors?.guests && <p className="text-xs text-coral mt-1">{errors.guests}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.specialRequests")}</label>
                      <textarea
                        value={requests}
                        onChange={(e) => setRequests(e.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder={t("booking.specialRequestsPlaceholder")}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean resize-none"
                      />
                    </div>

                    <button
                      onClick={handleContinue}
                      className="w-full bg-ocean hover:bg-ocean/90 text-white font-medium py-3 rounded-full transition-colors"
                    >
                      {t("booking.continue")}
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 space-y-5">
                    <h2 className="text-lg font-bold text-charcoal">{t("booking.contactInfo")}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.firstName")}</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        />
                        {errors?.firstName && <p className="text-xs text-coral mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.lastName")}</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        />
                        {errors?.lastName && <p className="text-xs text-coral mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.email")}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                      />
                      {errors?.email && <p className="text-xs text-coral mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">{t("booking.phone")}</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        placeholder="+52"
                      />
                      {errors?.phone && <p className="text-xs text-coral mt-1">{errors.phone}</p>}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 border border-gray-200 text-charcoal font-medium py-3 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        {t("booking.back")}
                      </button>
                      <button
                        onClick={handleContinue}
                        className="flex-1 bg-ocean hover:bg-ocean/90 text-white font-medium py-3 rounded-full transition-colors"
                      >
                        {t("booking.continue")}
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
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

                    {/* Accepted methods */}
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">{t("booking.mpAccepted")}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50">
                          <div className="w-8 h-8 flex items-center justify-center text-ocean">
                            <i className="ri-bank-card-line text-xl" />
                          </div>
                          <span className="text-xs text-center text-gray-600 leading-tight">{t("booking.mpCard")}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50">
                          <div className="w-8 h-8 flex items-center justify-center text-coral">
                            <i className="ri-store-line text-xl" />
                          </div>
                          <span className="text-xs text-center text-gray-600 leading-tight">{t("booking.mpOxxo")}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-3 border border-gray-100 rounded-xl bg-gray-50">
                          <div className="w-8 h-8 flex items-center justify-center text-turquoise">
                            <i className="ri-exchange-dollar-line text-xl" />
                          </div>
                          <span className="text-xs text-center text-gray-600 leading-tight">{t("booking.mpSpei")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order summary mini */}
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

                    {/* Trust badges */}
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 flex items-center justify-center text-ocean shrink-0 mt-0.5">
                        <i className="ri-shield-check-line" />
                      </div>
                      {t("booking.mpSecure")}
                    </div>

                    <p className="text-xs text-gray-500">
                      {t("booking.termsNote")}{" "}
                      <Link to="/" className="text-ocean hover:underline">{t("booking.termsLink")}</Link>.
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 border border-gray-200 text-charcoal font-medium py-3 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        {t("booking.back")}
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={processing}
                        className="flex-1 bg-coral hover:bg-coral/90 text-white font-medium py-3 rounded-full transition-colors disabled:opacity-70 inline-flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t("booking.processing")}
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 flex items-center justify-center"><i className="ri-arrow-right-line" /></div>
                            {t("booking.mpPayButton")}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price summary sidebar */}
              <div className="lg:w-80 shrink-0">
                <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <h3 className="text-base font-bold text-charcoal mb-4">{t("booking.priceSummary")}</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.adultsTotal")} ({adults})</span>
                      <span className="font-medium">${adultsTotal.toLocaleString(priceLocale)}</span>
                    </div>
                    {children > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("booking.childrenTotal")} ({children})</span>
                        <span className="font-medium">${childrenTotal.toLocaleString(priceLocale)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.subtotal")}</span>
                      <span className="font-medium">${subtotal.toLocaleString(priceLocale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("booking.taxes")}</span>
                      <span className="font-medium">${tax.toLocaleString(priceLocale)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between">
                      <span className="font-bold text-charcoal">{t("booking.total")}</span>
                      <span className="font-bold text-ocean text-lg">${total.toLocaleString(priceLocale)} MXN</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 flex items-center justify-center text-ocean"><i className="ri-checkbox-circle-line" /></div>
                      {t("booking.instantConfirm")}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 flex items-center justify-center text-ocean"><i className="ri-checkbox-circle-line" /></div>
                      {t("booking.freeCancel")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation step */}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../../provider/components/ProviderSidebar";

export default function ProveedorConfiguracionPage() {
  const { t } = useTranslation("provider");
  const [settings, setSettings] = useState({
    autoConfirm: true,
    instantBooking: true,
    minNotice: 24,
    maxGuests: 20,
    emailBookings: true,
    emailReviews: true,
    emailPayments: true,
    language: "es",
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0 space-y-6">
              {/* Booking settings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-charcoal mb-6">{t("provider.bookingSettings")}</h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{t("provider.autoConfirm")}</p>
                      <p className="text-xs text-gray-400">{t("provider.autoConfirmDesc")}</p>
                    </div>
                    <button onClick={() => toggle("autoConfirm")} className={`relative w-11 h-6 rounded-full transition-colors ${settings.autoConfirm ? "bg-ocean" : "bg-gray-200"}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoConfirm ? "right-1" : "left-1"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{t("provider.instantBooking")}</p>
                      <p className="text-xs text-gray-400">{t("provider.instantBookingDesc")}</p>
                    </div>
                    <button onClick={() => toggle("instantBooking")} className={`relative w-11 h-6 rounded-full transition-colors ${settings.instantBooking ? "bg-ocean" : "bg-gray-200"}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.instantBooking ? "right-1" : "left-1"}`} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.minNotice")}</label>
                      <div className="flex items-center gap-2">
                        <input type="number" value={settings.minNotice} onChange={(e) => setSettings((s) => ({ ...s, minNotice: Number(e.target.value) }))} className="w-24 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                        <span className="text-sm text-gray-500">{t("provider.hours")}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.maxGuests")}</label>
                      <input type="number" value={settings.maxGuests} onChange={(e) => setSettings((s) => ({ ...s, maxGuests: Number(e.target.value) }))} className="w-24 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-charcoal mb-6">{t("provider.notificationSettings")}</h2>
                <div className="space-y-4">
                  {[
                    { key: "emailBookings" as const, label: t("provider.emailBookings"), desc: t("provider.emailBookingsDesc") },
                    { key: "emailReviews" as const, label: t("provider.emailReviews"), desc: t("provider.emailReviewsDesc") },
                    { key: "emailPayments" as const, label: t("provider.emailPayments"), desc: t("provider.emailPaymentsDesc") },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-charcoal">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                      <button onClick={() => toggle(item.key)} className={`relative w-11 h-6 rounded-full transition-colors ${settings[item.key] ? "bg-ocean" : "bg-gray-200"}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key] ? "right-1" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-charcoal mb-4">{t("provider.language")}</h2>
                <select value={settings.language} onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))} className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean bg-white">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
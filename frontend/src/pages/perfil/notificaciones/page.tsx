import { useState } from "react";
import { useTranslation } from "react-i18next";
import ClientSidebar from "../components/ClientSidebar";

export default function PerfilNotificacionesPage() {
  const { t } = useTranslation("profile");
  const [settings, setSettings] = useState({
    emailBookings: true,
    emailPromos: false,
    emailNewsletter: true,
    pushBookings: true,
    pushReviews: true,
    smsReminders: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="notifications" />
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h1 className="text-lg font-bold text-charcoal mb-6">{t("profile.notifications")}</h1>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-semibold text-charcoal mb-3">{t("profile.emailNotifications")}</h2>
                    <div className="space-y-3">
                      {[
                        { key: "emailBookings" as const, label: t("profile.emailBookingsLabel"), desc: t("profile.emailBookingsDesc") },
                        { key: "emailPromos" as const, label: t("profile.emailPromosLabel"), desc: t("profile.emailPromosDesc") },
                        { key: "emailNewsletter" as const, label: t("profile.emailNewsletterLabel"), desc: t("profile.emailNewsletterDesc") },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-charcoal">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => toggle(item.key)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${settings[item.key] ? "bg-ocean" : "bg-gray-200"}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key] ? "right-1" : "left-1"}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-sm font-semibold text-charcoal mb-3">{t("profile.pushNotifications")}</h2>
                    <div className="space-y-3">
                      {[
                        { key: "pushBookings" as const, label: t("profile.pushBookingsLabel"), desc: t("profile.pushBookingsDesc") },
                        { key: "pushReviews" as const, label: t("profile.pushReviewsLabel"), desc: t("profile.pushReviewsDesc") },
                        { key: "smsReminders" as const, label: t("profile.smsRemindersLabel"), desc: t("profile.smsRemindersDesc") },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-charcoal">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => toggle(item.key)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${settings[item.key] ? "bg-ocean" : "bg-gray-200"}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key] ? "right-1" : "left-1"}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
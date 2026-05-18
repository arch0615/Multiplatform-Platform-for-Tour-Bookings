import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import WhatsAppButton from "@/components/feature/WhatsAppButton";

export default function ContactPage() {
  const { t } = useTranslation("contact");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <h1 className="font-display text-2xl md:text-4xl font-bold text-charcoal mb-3">{t("contact.title")}</h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">{t("contact.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Contact info sidebar */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-charcoal text-sm mb-4">{t("contact.infoTitle")}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean shrink-0">
                      <i className="ri-mail-line" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{t("contact.emailLabel")}</p>
                      <p className="text-sm font-medium text-charcoal">hola@bajatours.mx</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean shrink-0">
                      <i className="ri-phone-line" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{t("contact.phoneLabel")}</p>
                      <p className="text-sm font-medium text-charcoal">+52 612 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean shrink-0">
                      <i className="ri-map-pin-line" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{t("contact.addressLabel")}</p>
                      <p className="text-sm font-medium text-charcoal">La Paz, B.C.S., México</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                      <i className="ri-whatsapp-line" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{t("contact.whatsappLabel")}</p>
                      <a
                        href="https://wa.me/526121234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-emerald-600 hover:underline"
                      >
                        +52 612 123 4567
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-charcoal text-sm mb-4">{t("contact.hoursTitle")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("contact.weekdays")}</span>
                    <span className="font-medium text-charcoal">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("contact.saturday")}</span>
                    <span className="font-medium text-charcoal">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("contact.sunday")}</span>
                    <span className="font-medium text-charcoal">{t("contact.closed")}</span>
                  </div>
                </div>
              </div>

              <div className="bg-ocean rounded-2xl p-6 text-white">
                <h3 className="font-semibold text-sm mb-2">{t("contact.emergencyTitle")}</h3>
                <p className="text-white/80 text-xs leading-relaxed mb-4">{t("contact.emergencyDesc")}</p>
                <a
                  href="https://wa.me/526121234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-ocean text-xs font-medium px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
                >
                  <i className="ri-whatsapp-line" />
                  {t("contact.emergencyButton")}
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <i className="ri-check-line text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">{t("contact.sentTitle")}</h3>
                  <p className="text-sm text-gray-500 max-w-sm">{t("contact.sentDesc")}</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 text-sm text-ocean font-medium hover:underline"
                  >
                    {t("contact.sendAnother")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">{t("contact.nameLabel")}</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        placeholder={t("contact.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">{t("contact.emailLabel")}</label>
                      <input
                        type="email"
                        required
                        name="email"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("contact.subjectLabel")}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                      placeholder={t("contact.subjectPlaceholder")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("contact.messageLabel")}</label>
                    <textarea
                      required
                      rows={5}
                      maxLength={500}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean resize-none"
                      placeholder={t("contact.messagePlaceholder")}
                    />
                    <p className="text-xs text-gray-400 mt-1">{t("contact.maxChars")}</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-ocean hover:bg-ocean/90 text-white font-medium py-3 rounded-full transition-colors"
                  >
                    {t("contact.sendButton")}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    {t("contact.privacyNote")}{" "}
                    <Link to="/privacidad" className="text-ocean hover:underline">{t("contact.privacyLink")}</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
}
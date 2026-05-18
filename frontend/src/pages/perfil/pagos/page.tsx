import { useState } from "react";
import { useTranslation } from "react-i18next";
import ClientSidebar from "../components/ClientSidebar";

const mockCards = [
  { id: 1, brand: "Visa", last4: "4242", expiry: "12/27", default: true },
  { id: 2, brand: "Mastercard", last4: "8888", expiry: "06/28", default: false },
];

export default function PerfilPagosPage() {
  const { t } = useTranslation("profile");
  const [cards, setCards] = useState(mockCards);
  const [showAdd, setShowAdd] = useState(false);

  const setDefault = (id: number) => {
    setCards((prev) => prev.map((c) => ({ ...c, default: c.id === id })));
  };

  const removeCard = (id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="payments" />
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-lg font-bold text-charcoal">{t("profile.paymentMethods")}</h1>
                  <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-medium px-4 py-2 rounded-full"
                  >
                    <i className="ri-add-line" /> {t("profile.addCard")}
                  </button>
                </div>

                {showAdd && (
                  <div className="p-4 bg-gray-50 rounded-xl mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.cardNumber")}</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.cardExpiry")}</label>
                        <input type="text" placeholder="MM/YY" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">CVC</label>
                        <input type="text" placeholder="123" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="bg-ocean text-white text-sm font-medium px-4 py-2 rounded-full">{t("profile.save")}</button>
                      <button onClick={() => setShowAdd(false)} className="border border-gray-200 text-charcoal text-sm font-medium px-4 py-2 rounded-full">{t("profile.cancel")}</button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {cards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-100">
                          <i className={`ri-${card.brand.toLowerCase()}-fill text-lg text-charcoal`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal">{card.brand} ···· {card.last4}</p>
                          <p className="text-xs text-gray-400">{t("profile.expires")} {card.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {card.default ? (
                          <span className="text-xs font-medium text-ocean bg-ocean/10 px-2 py-1 rounded-full">{t("profile.default")}</span>
                        ) : (
                          <button onClick={() => setDefault(card.id)} className="text-xs text-ocean hover:underline">{t("profile.setDefault")}</button>
                        )}
                        <button onClick={() => removeCard(card.id)} className="text-xs text-coral hover:underline">{t("profile.remove")}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../components/ProviderSidebar";

const days = ["provider.sun", "provider.mon", "provider.tue", "provider.wed", "provider.thu", "provider.fri", "provider.sat"];

const may2026 = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const dow = (new Date(2026, 4, day).getDay());
  const status = day === 15 || day === 18 || day === 22 ? "booked" : day === 25 || day === 28 ? "blocked" : "available";
  const bookings = status === "booked" ? Math.floor(Math.random() * 8) + 1 : 0;
  return { day, dow, status, bookings };
});

export default function ProviderCalendar() {
  const { t } = useTranslation("provider");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{t("provider.calendar")}</h1>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-ocean/20" /> {t("provider.available")}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-ocean" /> {t("provider.booked")}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-gray-300" /> {t("provider.blocked")}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-charcoal">Mayo 2026</h2>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {days.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">
                      {t(d)}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {may2026.map((d) => {
                    const isSelected = selectedDate === d.day;
                    return (
                      <button
                        key={d.day}
                        onClick={() => setSelectedDate(d.day)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition-all ${
                          isSelected
                            ? "ring-2 ring-ocean bg-ocean/5"
                            : d.status === "booked"
                            ? "bg-ocean text-white"
                            : d.status === "blocked"
                            ? "bg-gray-100 text-gray-400"
                            : "bg-ocean/10 text-charcoal hover:bg-ocean/20"
                        }`}
                      >
                        <span className="font-semibold">{d.day}</span>
                        {d.bookings > 0 && <span className="text-[10px] opacity-80">{d.bookings}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected date details */}
              {selectedDate && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-charcoal">{selectedDate} de mayo, 2026</h3>
                    <div className="flex gap-2">
                      <button className="text-xs font-medium text-ocean border border-ocean px-3 py-1.5 rounded-full hover:bg-ocean/5">
                        {t("provider.blockDate")}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/10 text-ocean">
                        <i className="ri-sailboat-line" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">Snorkel con tiburón ballena</p>
                        <p className="text-xs text-gray-500">09:00 — 4 adultos, 1 niño</p>
                      </div>
                      <span className="ml-auto text-sm font-bold text-ocean">$5,400</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/10 text-ocean">
                        <i className="ri-sailboat-line" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">Avistamiento de ballenas</p>
                        <p className="text-xs text-gray-500">14:00 — 2 adultos</p>
                      </div>
                      <span className="ml-auto text-sm font-bold text-ocean">$4,800</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
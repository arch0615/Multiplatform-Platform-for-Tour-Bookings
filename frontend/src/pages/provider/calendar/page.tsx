import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../components/ProviderSidebar";
import { ApiError } from "@/lib/api";
import {
  getMyTourAvailability,
  writeMyTourAvailability,
  type AvailabilityWindow,
} from "@/lib/availability";
import { listMyTours, type ProviderTour } from "@/lib/providerTours";

type EditTarget = {
  date: string;
  capacity: string;
  startTime: string;
  priceOverride: string;
  remaining: number;
  booked: number;
};

function startOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function ymd(d: Date): string { return d.toISOString().slice(0, 10); }
function monthLabel(d: Date, locale: string): string {
  return d.toLocaleDateString(locale, { year: "numeric", month: "long" });
}

// Cell visual states. Background + border + text reflect intuitive go/caution/stop
// semantics so the calendar reads at a glance.
type CellState =
  | "past"
  | "noConfig"
  | "closed"
  | "full"
  | "limited"
  | "available";

function cellClassesFor(state: CellState): string {
  switch (state) {
    case "past":
      return "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed";
    case "noConfig":
      return "bg-white border-dashed border-gray-200 text-gray-400 hover:border-ocean cursor-pointer";
    case "closed":
      return "bg-gray-100 border-gray-200 text-gray-500 cursor-pointer";
    case "full":
      return "bg-coral/10 border-coral/40 text-coral hover:border-coral cursor-pointer";
    case "limited":
      return "bg-amber-50 border-amber-300 text-amber-800 hover:border-amber-500 cursor-pointer";
    case "available":
      return "bg-emerald-50 border-emerald-300 text-emerald-800 hover:border-emerald-500 cursor-pointer";
  }
}

function legendSwatch(state: CellState): string {
  switch (state) {
    case "available":
      return "bg-emerald-50 border-emerald-300";
    case "limited":
      return "bg-amber-50 border-amber-300";
    case "full":
      return "bg-coral/10 border-coral/40";
    case "closed":
      return "bg-gray-100 border-gray-200";
    case "noConfig":
      return "bg-white border-dashed border-gray-200";
    case "past":
      return "bg-gray-50 border-gray-100";
  }
}

export default function ProviderCalendar() {
  const { t, i18n } = useTranslation("provider");
  const dateLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [tours, setTours] = useState<ProviderTour[]>([]);
  const [tourId, setTourId] = useState<string>("");
  const [month, setMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditTarget | null>(null);
  const [saving, setSaving] = useState(false);

  // ISO-week order Mon..Sun. Use a known Monday (2024-01-01) seed so the
  // browser's Intl gives us locale-correct narrow weekday letters: "L M X J V S D"
  // for es-MX, "M T W T F S S" for en-US.
  const weekHeader = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(dateLocale, { weekday: "narrow" });
    const monday = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return fmt.format(d);
    });
  }, [dateLocale]);

  useEffect(() => {
    let cancelled = false;
    listMyTours()
      .then((ts) => {
        if (cancelled) return;
        setTours(ts);
        if (ts.length > 0) setTourId((id) => id || ts[0].id);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("provider.calLoadToursError"));
      });
    return () => { cancelled = true; };
  }, [t]);

  const refresh = useCallback(async () => {
    if (!tourId) { setWindows([]); setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const from = ymd(startOfMonth(month));
      const to = ymd(endOfMonth(month));
      const list = await getMyTourAvailability(tourId, from, to);
      setWindows(list);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("provider.calLoadAvailError"));
      setWindows([]);
    } finally {
      setLoading(false);
    }
  }, [tourId, month, t]);

  useEffect(() => { refresh(); }, [refresh]);

  const cells = useMemo(() => {
    const first = startOfMonth(month);
    const last = endOfMonth(month);
    // ISO week (Mon=0)
    const offset = (first.getDay() + 6) % 7;
    const days: Array<{ date: Date | null; w?: AvailabilityWindow }> = [];
    for (let i = 0; i < offset; i++) days.push({ date: null });
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      const key = ymd(date);
      const w = windows.find((x) => x.date.slice(0, 10) === key);
      days.push({ date, w });
    }
    return days;
  }, [month, windows]);

  // Memo today's epoch midnight once per render so each cell comparison is cheap
  // and consistent across the grid.
  const todayMidnight = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)).getTime(), []);

  const openEditor = (date: Date, w?: AvailabilityWindow) => {
    const booked = w ? w.capacity - w.remaining : 0;
    setEditing({
      date: ymd(date),
      capacity: String(w?.capacity ?? 10),
      startTime: w?.startTime?.slice(0, 5) ?? "09:00",
      priceOverride: w?.priceOverride != null ? String(w.priceOverride) : "",
      remaining: w?.remaining ?? 0,
      booked,
    });
  };

  const handleSave = async () => {
    if (!editing || !tourId) return;
    const capacity = parseInt(editing.capacity, 10);
    if (Number.isNaN(capacity) || capacity < 0) {
      setError(t("provider.calCapacityValidation")); return;
    }
    setSaving(true); setError(null);
    try {
      await writeMyTourAvailability(tourId, [{
        date: editing.date,
        startTime: editing.startTime || null,
        capacity,
        priceOverride: editing.priceOverride ? Number(editing.priceOverride) : null,
      }]);
      setEditing(null);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("provider.calSaveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-charcoal mb-6">
                {t("provider.calendar")}
              </h1>

              {error && (
                <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <label className="text-sm font-medium text-charcoal whitespace-nowrap">{t("provider.calTourLabel")}</label>
                    <select
                      value={tourId}
                      onChange={(e) => setTourId(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                    >
                      {tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>{tour.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
                      aria-label={t("provider.calPrevMonth")}
                    >
                      <i className="ri-arrow-left-s-line" />
                    </button>
                    <span className="text-sm font-medium text-charcoal capitalize min-w-[120px] text-center">
                      {monthLabel(month, dateLocale)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
                      aria-label={t("provider.calNextMonth")}
                    >
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="h-72 bg-gray-50 rounded-xl animate-pulse" />
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-1 text-xs font-medium text-gray-400 mb-1">
                      {weekHeader.map((d, i) => (
                        <div key={i} className="text-center py-1 uppercase">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((cell, i) => {
                        if (!cell.date) return <div key={i} className="aspect-square" />;
                        const w = cell.w;
                        const dayNum = cell.date.getDate();
                        const isPast = cell.date.getTime() < todayMidnight;
                        const isToday = cell.date.getTime() === todayMidnight;

                        // Classify into a single semantic state for color + legend coherence.
                        let state: CellState;
                        if (isPast) state = "past";
                        else if (!w) state = "noConfig";
                        else if (w.capacity === 0) state = "closed";
                        else if (w.remaining === 0) state = "full";
                        else if (w.remaining / w.capacity < 0.5) state = "limited";
                        else state = "available";

                        const booked = w ? w.capacity - w.remaining : 0;
                        let cls = "relative aspect-square rounded-lg p-1.5 border flex flex-col items-stretch text-left transition-colors ";
                        cls += cellClassesFor(state);
                        if (isToday) cls += " ring-2 ring-ocean ring-offset-1";

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isPast}
                            onClick={() => !isPast && openEditor(cell.date!, w)}
                            className={cls}
                          >
                            {/* Header: date + booked badge */}
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-semibold leading-none">{dayNum}</span>
                              {booked > 0 && (
                                <span
                                  className="min-w-[16px] h-4 px-1 rounded-full bg-ocean text-white text-[10px] font-semibold flex items-center justify-center leading-none"
                                  title={t("provider.calBookedCount", { count: booked })}
                                >
                                  {booked}
                                </span>
                              )}
                            </div>

                            {/* Body: status word + count detail + optional time/price */}
                            {!isPast && (
                              <div className="mt-auto space-y-0.5 text-[10px] leading-tight">
                                {state === "noConfig" && (
                                  <div className="opacity-70 italic">{t("provider.calNotSet")}</div>
                                )}
                                {state === "closed" && (
                                  <div className="font-semibold">{t("provider.calClosed")}</div>
                                )}
                                {state === "full" && w && (
                                  <>
                                    <div className="font-semibold">{t("provider.calFull")}</div>
                                    <div className="opacity-75 hidden sm:block">{t("provider.calBookedCount", { count: w.capacity })}</div>
                                  </>
                                )}
                                {(state === "available" || state === "limited") && w && (
                                  <>
                                    <div className="font-semibold">{t("provider.calAvailableCount", { count: w.remaining })}</div>
                                    {booked > 0 && (
                                      <div className="opacity-75 hidden sm:block">{t("provider.calBookedCount", { count: booked })}</div>
                                    )}
                                  </>
                                )}
                                {w?.startTime && state !== "closed" && (
                                  <div className="opacity-70 hidden sm:block">{w.startTime.slice(0, 5)}</div>
                                )}
                                {w?.priceOverride != null && state !== "closed" && (
                                  <div className="font-medium text-ocean hidden sm:block">${w.priceOverride}</div>
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-500">
                      {(["available", "limited", "full", "closed", "noConfig"] as const).map((s) => (
                        <span key={s} className="flex items-center gap-1.5">
                          <span className={`w-3 h-3 rounded-sm border ${legendSwatch(s)}`} />
                          {t(`provider.cal${s.charAt(0).toUpperCase() + s.slice(1)}` as const)}
                        </span>
                      ))}
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm border border-ocean ring-1 ring-ocean ring-offset-1" />
                        {t("provider.calToday")}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 max-h-full overflow-y-auto">
            <h2 className="text-lg font-bold text-charcoal">{t("provider.calConfigureTitle")}</h2>
            <p className="text-sm text-gray-500">{editing.date}</p>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("provider.calCapacityLabel")}</label>
              <input
                type="number" min="0" step="1"
                value={editing.capacity}
                onChange={(e) => setEditing({ ...editing, capacity: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
              />
              <p className="text-xs text-gray-400 mt-1">
                {t("provider.calCapacityHint", { count: editing.booked })}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("provider.calStartTimeLabel")}</label>
              <input
                type="time"
                value={editing.startTime}
                onChange={(e) => setEditing({ ...editing, startTime: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("provider.calPriceOverrideLabel")}</label>
              <input
                type="number" min="0" step="1"
                value={editing.priceOverride}
                onChange={(e) => setEditing({ ...editing, priceOverride: e.target.value })}
                placeholder={t("provider.calPriceOverridePlaceholder")}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={saving}
                className="flex-1 border border-gray-200 text-charcoal text-sm font-medium px-4 py-2.5 rounded-full hover:bg-gray-50 disabled:opacity-50"
              >{t("provider.calCancel")}</button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-ocean text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-ocean/90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {t("provider.calSave")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

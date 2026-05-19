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
  remaining: number; // for display
};

function startOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function ymd(d: Date): string { return d.toISOString().slice(0, 10); }
function monthLabel(d: Date, locale: string): string {
  return d.toLocaleDateString(locale, { year: "numeric", month: "long" });
}

const weekHeader = ["L", "M", "X", "J", "V", "S", "D"];

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
        setError(err instanceof ApiError ? err.message : "No pudimos cargar tus tours.");
      });
    return () => { cancelled = true; };
  }, []);

  const refresh = useCallback(async () => {
    if (!tourId) { setWindows([]); setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const from = ymd(startOfMonth(month));
      const to = ymd(endOfMonth(month));
      const list = await getMyTourAvailability(tourId, from, to);
      setWindows(list);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos cargar la disponibilidad.");
      setWindows([]);
    } finally {
      setLoading(false);
    }
  }, [tourId, month]);

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

  const openEditor = (date: Date, w?: AvailabilityWindow) => {
    setEditing({
      date: ymd(date),
      capacity: String(w?.capacity ?? 10),
      startTime: w?.startTime?.slice(0, 5) ?? "09:00",
      priceOverride: w?.priceOverride != null ? String(w.priceOverride) : "",
      remaining: w?.remaining ?? 0,
    });
  };

  const handleSave = async () => {
    if (!editing || !tourId) return;
    const capacity = parseInt(editing.capacity, 10);
    if (Number.isNaN(capacity) || capacity < 0) {
      setError("La capacidad debe ser un número ≥ 0."); return;
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
      setError(err instanceof ApiError ? err.message : "No pudimos guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-charcoal mb-6">
                {t("provider.calendar", { defaultValue: "Calendario y disponibilidad" })}
              </h1>

              {error && (
                <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <label className="text-sm font-medium text-charcoal whitespace-nowrap">Tour:</label>
                    <select
                      value={tourId}
                      onChange={(e) => setTourId(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                    >
                      {tours.map((t) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
                      aria-label="Mes anterior"
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
                      aria-label="Siguiente mes"
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
                      {weekHeader.map((d) => (
                        <div key={d} className="text-center py-1">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((cell, i) => {
                        if (!cell.date) return <div key={i} className="aspect-square" />;
                        const w = cell.w;
                        const dayNum = cell.date.getDate();
                        const isPast = cell.date < new Date(new Date().setHours(0, 0, 0, 0));
                        let cls = "aspect-square rounded-lg p-1.5 border flex flex-col items-stretch text-left transition-colors";
                        if (isPast) cls += " bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed";
                        else if (!w) cls += " bg-white border-gray-200 text-gray-400 hover:border-ocean cursor-pointer";
                        else if (w.remaining === 0 && w.capacity > 0) cls += " bg-coral/10 border-coral/30 text-coral hover:border-coral cursor-pointer";
                        else if (w.capacity === 0) cls += " bg-gray-100 border-gray-200 text-gray-400 cursor-pointer";
                        else cls += " bg-ocean/5 border-ocean/30 text-charcoal hover:border-ocean cursor-pointer";

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isPast}
                            onClick={() => !isPast && openEditor(cell.date!, w)}
                            className={cls}
                          >
                            <span className="text-xs font-semibold leading-none">{dayNum}</span>
                            {w && (
                              <div className="mt-auto text-[10px] leading-tight">
                                {w.capacity === 0
                                  ? <span>Cerrado</span>
                                  : w.remaining === 0
                                    ? <span>Lleno</span>
                                    : <>
                                        <div>{w.remaining}/{w.capacity}</div>
                                        {w.priceOverride != null && <div className="text-ocean">${w.priceOverride}</div>}
                                      </>
                                }
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-ocean/5 border border-ocean/30" /> Disponible
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-coral/10 border border-coral/30" /> Lleno
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" /> Cerrado
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-white border border-gray-200" /> Sin configurar
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
            <h2 className="text-lg font-bold text-charcoal">Configurar disponibilidad</h2>
            <p className="text-sm text-gray-500">{editing.date}</p>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cupo total</label>
              <input
                type="number" min="0" step="1"
                value={editing.capacity}
                onChange={(e) => setEditing({ ...editing, capacity: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
              />
              <p className="text-xs text-gray-400 mt-1">
                Pon 0 para cerrar ese día. Si ya hay reservas, la capacidad no puede bajar de las {editing.remaining > 0 ? "reservadas." : "0."}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hora de salida (opcional)</label>
              <input
                type="time"
                value={editing.startTime}
                onChange={(e) => setEditing({ ...editing, startTime: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Precio especial del día (MXN, opcional)</label>
              <input
                type="number" min="0" step="1"
                value={editing.priceOverride}
                onChange={(e) => setEditing({ ...editing, priceOverride: e.target.value })}
                placeholder="Usa el precio normal del tour"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={saving}
                className="flex-1 border border-gray-200 text-charcoal text-sm font-medium px-4 py-2.5 rounded-full hover:bg-gray-50 disabled:opacity-50"
              >Cancelar</button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-ocean text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-ocean/90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

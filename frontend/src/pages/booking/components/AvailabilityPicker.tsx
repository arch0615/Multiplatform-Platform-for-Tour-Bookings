import { useEffect, useMemo, useState } from "react";
import { getPublicAvailability, type PublicAvailabilitySlot } from "@/lib/availability";

interface Props {
  slug: string;
  guests: number;
  value: string;
  onChange: (date: string, slot: PublicAvailabilitySlot | null) => void;
  locale: string;
  /** If false, no availability rows exist for this tour — we hide ourselves and the parent falls back to a plain date input. */
  onEmpty?: () => void;
}

function ymd(d: Date): string { return d.toISOString().slice(0, 10); }
function startOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function ymKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const weekHeader = ["L", "M", "X", "J", "V", "S", "D"];

export default function AvailabilityPicker({ slug, guests, value, onChange, locale, onEmpty }: Props) {
  const [month, setMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [slots, setSlots] = useState<PublicAvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    getPublicAvailability(slug, ymKey(month))
      .then((s) => {
        if (cancelled) return;
        setSlots(s);
        // Probe: if we just loaded the current month and got 0 slots, ask another month
        // before declaring "empty". Empty for 3 consecutive months → tell parent to fall back.
        if (s.length === 0 && month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear()) {
          // best-effort: keep showing the calendar empty (the parent already wired this for fallback via onEmpty in mount probe)
        }
      })
      .catch((e) => { if (!cancelled) setError(String(e?.message ?? e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, month]);

  // First-mount probe: if NO slots exist in a 6-month window, tell the parent to fall back.
  useEffect(() => {
    if (!onEmpty) return;
    let cancelled = false;
    (async () => {
      const today = new Date();
      let anyFound = false;
      for (let i = 0; i < 6 && !anyFound; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
        try {
          const s = await getPublicAvailability(slug, ymKey(d));
          if (s.length > 0) anyFound = true;
        } catch {
          // give up on errors — parent's regular load path will show the error
          return;
        }
        if (cancelled) return;
      }
      if (!anyFound && !cancelled) onEmpty();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const cells = useMemo(() => {
    const first = startOfMonth(month);
    const last = endOfMonth(month);
    const offset = (first.getDay() + 6) % 7;
    const days: Array<{ date: Date | null; slot?: PublicAvailabilitySlot }> = [];
    for (let i = 0; i < offset; i++) days.push({ date: null });
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      const key = ymd(date);
      const slot = slots.find((x) => x.date.slice(0, 10) === key);
      days.push({ date, slot });
    }
    return days;
  }, [month, slots]);

  const monthLabel = month.toLocaleDateString(locale, { year: "numeric", month: "long" });

  return (
    <div className="border border-gray-200 rounded-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
        >
          <i className="ri-arrow-left-s-line" />
        </button>
        <span className="text-sm font-medium text-charcoal capitalize">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
        >
          <i className="ri-arrow-right-s-line" />
        </button>
      </div>

      {error && <p className="text-xs text-coral mb-2">{error}</p>}

      <div className="grid grid-cols-7 gap-1 text-[10px] font-medium text-gray-400 mb-1">
        {weekHeader.map((d) => <div key={d} className="text-center py-1">{d}</div>)}
      </div>

      {loading ? (
        <div className="h-48 bg-gray-50 rounded animate-pulse" />
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell.date) return <div key={i} className="aspect-square" />;
            const dayNum = cell.date.getDate();
            const isPast = cell.date < new Date(new Date().setHours(0, 0, 0, 0));
            const slot = cell.slot;
            const enough = slot ? slot.remaining >= guests : false;
            const isSelected = value === ymd(cell.date);

            let cls = "aspect-square rounded-lg p-1 border text-center transition-colors text-xs flex flex-col items-center justify-center";
            if (isPast) cls += " bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed";
            else if (!slot || !enough) cls += " bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed";
            else if (isSelected) cls += " bg-ocean text-white border-ocean";
            else cls += " bg-white border-gray-200 text-charcoal hover:border-ocean cursor-pointer";

            return (
              <button
                key={i}
                type="button"
                disabled={isPast || !slot || !enough}
                onClick={() => onChange(ymd(cell.date!), slot!)}
                className={cls}
                title={slot && enough ? `${slot.remaining} lugares` : undefined}
              >
                <span className="font-semibold leading-none">{dayNum}</span>
                {slot && enough && !isSelected && (
                  <span className="text-[9px] leading-none mt-0.5 text-gray-400">{slot.remaining}</span>
                )}
                {slot?.priceOverride != null && !isSelected && (
                  <span className="text-[9px] leading-none mt-0.5 text-ocean">${slot.priceOverride}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-gray-400 mt-2">
        Solo los días con cupo suficiente para {guests} {guests === 1 ? "huésped" : "huéspedes"} son seleccionables.
      </p>
    </div>
  );
}

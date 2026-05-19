import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ApiError } from "@/lib/api";
import {
  archiveCoupon,
  createCoupon,
  listCoupons,
  updateCoupon,
  type Coupon,
  type WriteCouponInput,
} from "@/lib/coupons";

type FormState = {
  code: string;
  description: string;
  kind: "percent" | "fixed";
  percent: string;
  amount: string;
  validFrom: string;
  validUntil: string;
  maxRedemptions: string;
  active: boolean;
};

const emptyForm: FormState = {
  code: "",
  description: "",
  kind: "percent",
  percent: "10",
  amount: "",
  validFrom: "",
  validUntil: "",
  maxRedemptions: "",
  active: true,
};

function couponToForm(c: Coupon): FormState {
  return {
    code: c.code,
    description: c.description ?? "",
    kind: c.discountPercent > 0 ? "percent" : "fixed",
    percent: c.discountPercent > 0 ? String(Math.round(c.discountPercent * 100 * 100) / 100) : "",
    amount: c.discountAmount != null ? String(c.discountAmount) : "",
    validFrom: c.validFrom ?? "",
    validUntil: c.validUntil ?? "",
    maxRedemptions: c.maxRedemptions != null ? String(c.maxRedemptions) : "",
    active: c.active,
  };
}

function formToWrite(f: FormState): WriteCouponInput | { error: string } {
  const code = f.code.trim().toUpperCase();
  if (!code) return { error: "El código es requerido." };

  if (f.kind === "percent") {
    const n = parseFloat(f.percent);
    if (Number.isNaN(n) || n <= 0 || n > 100) return { error: "El porcentaje debe estar entre 1 y 100." };
    return {
      code,
      description: f.description.trim() || null,
      discountPercent: n / 100,
      discountAmount: null,
      validFrom: f.validFrom || null,
      validUntil: f.validUntil || null,
      maxRedemptions: f.maxRedemptions ? parseInt(f.maxRedemptions, 10) : null,
      active: f.active,
    };
  } else {
    const n = parseFloat(f.amount);
    if (Number.isNaN(n) || n <= 0) return { error: "El monto debe ser mayor a 0." };
    return {
      code,
      description: f.description.trim() || null,
      discountPercent: 0,
      discountAmount: n,
      validFrom: f.validFrom || null,
      validUntil: f.validUntil || null,
      maxRedemptions: f.maxRedemptions ? parseInt(f.maxRedemptions, 10) : null,
      active: f.active,
    };
  }
}

export default function AdminCuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try { setCoupons(await listCoupons()); }
    catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos cargar los cupones.");
      setCoupons([]);
    }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const sorted = useMemo(() =>
    [...coupons].sort((a, b) => Number(b.active) - Number(a.active) || b.createdAt.localeCompare(a.createdAt)),
    [coupons]);

  const startCreate = () => {
    setEditingId(null); setForm({ ...emptyForm }); setFormError(null); setOpenForm(true);
  };
  const startEdit = (c: Coupon) => {
    setEditingId(c.id); setForm(couponToForm(c)); setFormError(null); setOpenForm(true);
  };
  const closeForm = () => { setOpenForm(false); setEditingId(null); setForm(emptyForm); setFormError(null); };

  const handleSave = async () => {
    setFormError(null);
    const payload = formToWrite(form);
    if ("error" in payload) { setFormError(payload.error); return; }
    setSaving(true);
    try {
      if (editingId) await updateCoupon(editingId, payload);
      else await createCoupon(payload);
      await refresh();
      closeForm();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Ocurrió un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (c: Coupon) => {
    if (!window.confirm(`¿Desactivar el cupón ${c.code}?`)) return;
    try { await archiveCoupon(c.id); await refresh(); }
    catch { /* keep view */ }
  };

  return (
    <AdminLayout title="Cupones">
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-ocean/90"
        >
          <i className="ri-add-line" /> Nuevo cupón
        </button>
      </div>

      {error && (
        <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 animate-pulse h-40" />
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-sm text-gray-500">Aún no hay cupones. Crea el primero.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
              <tr>
                <th className="text-left px-5 py-3">Código</th>
                <th className="text-left px-5 py-3">Descuento</th>
                <th className="text-left px-5 py-3">Validez</th>
                <th className="text-left px-5 py-3">Usos</th>
                <th className="text-left px-5 py-3">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => {
                const discount = c.discountPercent > 0
                  ? `${Math.round(c.discountPercent * 100 * 100) / 100}%`
                  : c.discountAmount != null ? `$${c.discountAmount.toLocaleString("es-MX")} MXN` : "—";
                const validity = c.validUntil ? `hasta ${c.validUntil}` : c.validFrom ? `desde ${c.validFrom}` : "sin caducidad";
                const usage = c.maxRedemptions != null ? `${c.redeemed} / ${c.maxRedemptions}` : `${c.redeemed}`;
                return (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-mono font-semibold text-charcoal whitespace-nowrap">{c.code}</td>
                    <td className="px-5 py-3 text-charcoal whitespace-nowrap">{discount}</td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{validity}</td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{usage}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button onClick={() => startEdit(c)} className="text-xs font-medium text-ocean hover:underline mr-3">Editar</button>
                      {c.active && (
                        <button onClick={() => handleArchive(c)} className="text-xs font-medium text-coral hover:underline">Desactivar</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {openForm && (
        <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 max-h-full overflow-y-auto">
            <h2 className="text-lg font-bold text-charcoal">{editingId ? "Editar cupón" : "Nuevo cupón"}</h2>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Código</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean uppercase font-mono"
                maxLength={32}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Descripción (opcional)</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de descuento</label>
              <div className="flex gap-2">
                <label className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="radio" name="kind" checked={form.kind === "percent"} onChange={() => setForm({ ...form, kind: "percent" })} className="accent-ocean" />
                  <span className="text-sm">Porcentaje</span>
                </label>
                <label className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="radio" name="kind" checked={form.kind === "fixed"} onChange={() => setForm({ ...form, kind: "fixed" })} className="accent-ocean" />
                  <span className="text-sm">Monto fijo</span>
                </label>
              </div>
            </div>

            {form.kind === "percent" ? (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Porcentaje (1–100)</label>
                <div className="relative">
                  <input
                    type="number" min="1" max="100" step="1"
                    value={form.percent}
                    onChange={(e) => setForm({ ...form, percent: e.target.value })}
                    className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Monto (MXN)</label>
                <input
                  type="number" min="1" step="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
                <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
                <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Usos máximos (opcional)</label>
              <input
                type="number" min="1" step="1"
                value={form.maxRedemptions}
                onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })}
                placeholder="Sin límite"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-ocean"
              />
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-ocean" />
              <span className="text-sm text-charcoal">Activo</span>
            </label>

            {formError && (
              <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-3 py-2 rounded-lg">{formError}</div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeForm}
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
    </AdminLayout>
  );
}

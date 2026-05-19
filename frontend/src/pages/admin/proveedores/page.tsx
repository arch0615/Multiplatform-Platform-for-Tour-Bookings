import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../components/AdminLayout";
import { ApiError } from "@/lib/api";
import { ProviderStatus } from "@/contexts/AuthContext";
import { listAdminProviders, suspendProvider, verifyProvider, type AdminProvider } from "@/lib/admin";

type Filter = "all" | "pending" | "active" | "suspended";

export default function AdminProveedoresPage() {
  const { t, i18n } = useTranslation("admin");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const refresh = () => {
    setLoading(true);
    setError(null);
    return listAdminProviders({ q: search.trim() || undefined })
      .then((items) => setProviders(items))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : t("admin.loadError", { defaultValue: "No pudimos cargar proveedores." }));
        setProviders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { void refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      if (filter === "pending") return p.status === ProviderStatus.PendingVerification;
      if (filter === "active") return p.status === ProviderStatus.Active;
      if (filter === "suspended") return p.status === ProviderStatus.Suspended;
      return true;
    });
  }, [providers, filter]);

  const statusLabel = (s: ProviderStatus): string => {
    if (s === ProviderStatus.Active) return t("admin.statusActive", { defaultValue: "Activo" });
    if (s === ProviderStatus.PendingVerification) return t("admin.statusPending", { defaultValue: "Pendiente" });
    return t("admin.statusSuspended", { defaultValue: "Suspendido" });
  };
  const statusColor = (s: ProviderStatus): string => {
    if (s === ProviderStatus.Active) return "bg-ocean/10 text-ocean";
    if (s === ProviderStatus.PendingVerification) return "bg-sand/60 text-charcoal";
    return "bg-coral/10 text-coral";
  };

  const onVerify = async (p: AdminProvider) => {
    if (!window.confirm(t("admin.confirmVerify", { defaultValue: "¿Verificar y activar este proveedor?" }))) return;
    setActingId(p.id);
    try { await verifyProvider(p.id); await refresh(); }
    catch (err) { alert(err instanceof ApiError ? err.message : t("admin.actionError", { defaultValue: "Error al ejecutar la acción." })); }
    finally { setActingId(null); }
  };

  const onSuspend = async (p: AdminProvider) => {
    const reason = window.prompt(t("admin.suspendReason", { defaultValue: "Motivo de la suspensión (opcional):" }));
    if (reason === null) return; // user cancelled
    setActingId(p.id);
    try { await suspendProvider(p.id, reason || undefined); await refresh(); }
    catch (err) { alert(err instanceof ApiError ? err.message : t("admin.actionError", { defaultValue: "Error al ejecutar la acción." })); }
    finally { setActingId(null); }
  };

  return (
    <AdminLayout title={t("admin.providers", { defaultValue: "Proveedores" })}>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
            <i className="ri-search-line" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void refresh(); }}
            placeholder={t("admin.searchPlaceholder", { defaultValue: "Buscar por empresa, email o ubicación" })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "active", "suspended"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                filter === f ? "bg-charcoal text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? t("admin.all", { defaultValue: "Todos" })
                : f === "pending" ? t("admin.statusPending", { defaultValue: "Pendiente" })
                : f === "active" ? t("admin.statusActive", { defaultValue: "Activo" })
                : t("admin.statusSuspended", { defaultValue: "Suspendido" })}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">{t("admin.noProviders", { defaultValue: "Sin coincidencias." })}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.companyColumn", { defaultValue: "Empresa" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.ownerColumn", { defaultValue: "Dueño" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.locationColumn", { defaultValue: "Ubicación" })}</th>
                <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.toursColumn", { defaultValue: "Tours" })}</th>
                <th className="text-right text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.revenueColumn", { defaultValue: "Ventas" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.commissionColumn", { defaultValue: "Comisión" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.status", { defaultValue: "Estado" })}</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3">{t("admin.actions", { defaultValue: "Acciones" })}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-charcoal">{p.companyName}</div>
                    {p.rfc && <div className="text-xs text-gray-400">RFC: {p.rfc}</div>}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-charcoal text-sm">{p.ownerFullName}</div>
                    <div className="text-xs text-gray-400">{p.ownerEmail}</div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{p.location ?? "—"}</td>
                  <td className="py-3 pr-4 text-right text-gray-600">{p.tourCount}</td>
                  <td className="py-3 pr-4 text-right text-charcoal">
                    ${p.lifetimeGross.toLocaleString(priceLocale, { maximumFractionDigits: 0 })}
                    <div className="text-[10px] text-gray-400">{p.bookingCount} {t("admin.bookings", { defaultValue: "reservas" })}</div>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{(p.commissionRate * 100).toFixed(1)}%</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusColor(p.status)}`}>
                      {statusLabel(p.status)}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-3">
                      {p.status === ProviderStatus.PendingVerification && (
                        <button
                          onClick={() => onVerify(p)}
                          disabled={actingId === p.id}
                          className="text-xs font-medium text-ocean hover:underline disabled:opacity-50"
                        >
                          {actingId === p.id ? "..." : t("admin.verify", { defaultValue: "Verificar" })}
                        </button>
                      )}
                      {p.status === ProviderStatus.Active && (
                        <button
                          onClick={() => onSuspend(p)}
                          disabled={actingId === p.id}
                          className="text-xs font-medium text-coral hover:underline disabled:opacity-50"
                        >
                          {actingId === p.id ? "..." : t("admin.suspend", { defaultValue: "Suspender" })}
                        </button>
                      )}
                      {p.status === ProviderStatus.Suspended && (
                        <button
                          onClick={() => onVerify(p)}
                          disabled={actingId === p.id}
                          className="text-xs font-medium text-ocean hover:underline disabled:opacity-50"
                        >
                          {actingId === p.id ? "..." : t("admin.reactivate", { defaultValue: "Reactivar" })}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

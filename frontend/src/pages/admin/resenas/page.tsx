import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ApiError } from "@/lib/api";
import {
  approveReview,
  listAdminReviews,
  rejectReview,
  ReviewSource,
  ReviewStatus,
  type AdminReview,
} from "@/lib/reviews";

type Tab = "pending" | "approved" | "rejected" | "all";

function tabToStatus(tab: Tab): ReviewStatus | undefined {
  if (tab === "pending") return ReviewStatus.Pending;
  if (tab === "approved") return ReviewStatus.Approved;
  if (tab === "rejected") return ReviewStatus.Rejected;
  return undefined;
}

function sourceBadge(s: ReviewSource): { label: string; className: string } {
  if (s === ReviewSource.Google) return { label: "Google", className: "bg-gray-100 text-gray-600" };
  if (s === ReviewSource.TripAdvisor) return { label: "TripAdvisor", className: "bg-gray-100 text-gray-600" };
  return { label: "Verificada", className: "bg-ocean/10 text-ocean" };
}

function statusBadge(s: ReviewStatus): { label: string; className: string } {
  if (s === ReviewStatus.Approved) return { label: "Aprobada", className: "bg-emerald-100 text-emerald-700" };
  if (s === ReviewStatus.Rejected) return { label: "Rechazada", className: "bg-coral/10 text-coral" };
  return { label: "Pendiente", className: "bg-sand/60 text-charcoal" };
}

export default function AdminResenasPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listAdminReviews(tabToStatus(tab));
      setReviews(items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos cargar las reseñas.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { refresh(); }, [refresh]);

  const counts = useMemo(() => ({
    pending: reviews.filter((r) => r.status === ReviewStatus.Pending).length,
    approved: reviews.filter((r) => r.status === ReviewStatus.Approved).length,
    rejected: reviews.filter((r) => r.status === ReviewStatus.Rejected).length,
  }), [reviews]);

  const handleApprove = async (r: AdminReview) => {
    setBusyId(r.id);
    try { await approveReview(r.id); await refresh(); }
    catch { /* keep current view */ }
    finally { setBusyId(null); }
  };

  const handleReject = async (r: AdminReview) => {
    setBusyId(r.id);
    try { await rejectReview(r.id); await refresh(); }
    catch { /* keep current view */ }
    finally { setBusyId(null); }
  };

  return (
    <AdminLayout title="Reseñas">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {(["pending", "approved", "rejected", "all"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === k ? "bg-charcoal text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {k === "pending" && `Pendientes${counts.pending ? ` · ${counts.pending}` : ""}`}
            {k === "approved" && "Aprobadas"}
            {k === "rejected" && "Rechazadas"}
            {k === "all" && "Todas"}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-gray-300">
              <i className="ri-chat-3-line text-3xl" />
            </div>
            <p className="text-sm text-gray-500">No hay reseñas en esta vista.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => {
              const src = sourceBadge(r.source);
              const st = statusBadge(r.status);
              const initial = r.authorName?.[0]?.toUpperCase() ?? "?";
              const dateStr = new Date(r.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });
              return (
                <div key={r.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/10 text-ocean font-bold text-sm shrink-0">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-charcoal">{r.authorName}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${src.className}`}>{src.label}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${st.className}`}>{st.label}</span>
                      <span className="text-xs text-gray-400">{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-coral mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className={i < r.rating ? "ri-star-fill text-xs" : "ri-star-line text-xs text-gray-200"} />
                      ))}
                      <span className="text-xs text-gray-500 ml-2 truncate max-w-[260px]">
                        {r.tourTitle} · {r.providerName}
                      </span>
                    </div>
                    {r.title && <p className="text-sm font-semibold text-charcoal mb-1">{r.title}</p>}
                    <p className="text-sm text-gray-600 mb-3 whitespace-pre-line">{r.comment}</p>

                    <div className="flex flex-wrap gap-2">
                      {r.status !== ReviewStatus.Approved && (
                        <button
                          onClick={() => handleApprove(r)}
                          disabled={busyId === r.id}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-ocean/10 text-ocean hover:bg-ocean/20 transition-colors disabled:opacity-50"
                        >
                          Aprobar
                        </button>
                      )}
                      {r.status !== ReviewStatus.Rejected && (
                        <button
                          onClick={() => handleReject(r)}
                          disabled={busyId === r.id}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-coral/10 text-coral hover:bg-coral/20 transition-colors disabled:opacity-50"
                        >
                          {r.status === ReviewStatus.Approved ? "Retirar" : "Rechazar"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

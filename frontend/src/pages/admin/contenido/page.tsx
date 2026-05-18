import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const pages = [
  { id: 1, title: "Sobre nosotros", slug: "about", type: "page", status: "published", updated: "2026-05-01" },
  { id: 2, title: "Preguntas frecuentes", slug: "faq", type: "page", status: "published", updated: "2026-04-20" },
  { id: 3, title: "Cómo funciona", slug: "how-it-works", type: "page", status: "published", updated: "2026-04-15" },
];

const banners = [
  { id: 1, title: "Hero verano 2026", position: "homepage", status: "active", clicks: 342 },
  { id: 2, title: "Promo familias", position: "homepage", status: "active", clicks: 128 },
];

export default function AdminContenidoPage() {
  const [tab, setTab] = useState<"pages" | "banners" | "blog">("pages");

  return (
    <AdminLayout title="Contenido">
      <div className="flex gap-2 mb-6">
        {([
          { key: "pages" as const, label: "Páginas" },
          { key: "banners" as const, label: "Banners" },
          { key: "blog" as const, label: "Blog" },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.key ? "bg-ocean text-white" : "bg-white border border-gray-200 text-charcoal hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pages" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Título</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Slug</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Estado</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Actualizado</th>
                <th className="text-left text-xs font-medium text-gray-400 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 pr-4 font-medium text-charcoal">{p.title}</td>
                  <td className="py-3 pr-4 text-gray-600">/{p.slug}</td>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-ocean/10 text-ocean">Publicada</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{p.updated}</td>
                  <td className="py-3">
                    <button className="text-xs text-ocean hover:underline">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "banners" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-charcoal mb-1">{b.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{b.position} · {b.clicks} clicks</p>
              <div className="flex gap-2">
                <button className="text-xs text-ocean hover:underline">Editar</button>
                <button className="text-xs text-coral hover:underline">{b.status === "active" ? "Desactivar" : "Activar"}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "blog" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-sm text-gray-500">Blog en desarrollo</p>
        </div>
      )}
    </AdminLayout>
  );
}
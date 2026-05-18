import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const helpCategories = [
  { id: "reservas", icon: "ri-calendar-check-line", title: "help.catReservas", desc: "help.catReservasDesc" },
  { id: "pagos", icon: "ri-bank-card-line", title: "help.catPagos", desc: "help.catPagosDesc" },
  { id: "proveedores", icon: "ri-store-2-line", title: "help.catProveedores", desc: "help.catProveedoresDesc" },
  { id: "cuenta", icon: "ri-user-settings-line", title: "help.catCuenta", desc: "help.catCuentaDesc" },
  { id: "cancelaciones", icon: "ri-refund-line", title: "help.catCancelaciones", desc: "help.catCancelacionesDesc" },
  { id: "seguridad", icon: "ri-shield-check-line", title: "help.catSeguridad", desc: "help.catSeguridadDesc" },
];

const popularArticles = [
  { slug: "como-reservar", title: "help.art1" },
  { slug: "metodos-de-pago", title: "help.art2" },
  { slug: "cancelar-reserva", title: "help.art3" },
  { slug: "registrarme-proveedor", title: "help.art4" },
];

export default function HelpPage() {
  const { t } = useTranslation("help");
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-2xl md:text-4xl font-bold text-charcoal mb-3">{t("help.title")}</h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">{t("help.subtitle")}</p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                <i className="ri-search-line" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("help.searchPlaceholder")}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-ocean"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {helpCategories.map((c) => (
              <Link
                key={c.id}
                to={`/ayuda/${c.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-ocean/30 transition-colors group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean mb-4 group-hover:bg-ocean/20 transition-colors">
                  <i className={`${c.icon} text-lg`} />
                </div>
                <h3 className="font-semibold text-charcoal text-sm mb-1">{t(c.title)}</h3>
                <p className="text-xs text-gray-500">{t(c.desc)}</p>
              </Link>
            ))}
          </div>

          {/* Popular articles */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-10">
            <h2 className="font-display text-lg md:text-xl font-bold text-charcoal mb-6">{t("help.popularTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularArticles.map((a) => (
                <Link
                  key={a.slug}
                  to={`/ayuda/${a.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-ocean/10 text-ocean shrink-0">
                    <i className="ri-file-text-line" />
                  </div>
                  <span className="text-sm font-medium text-charcoal">{t(a.title)}</span>
                  <i className="ri-arrow-right-s-line text-gray-400 ml-auto" />
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ shortcut */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">{t("help.faqPrompt")}</p>
            <Link
              to="/ayuda/faq"
              className="inline-flex items-center justify-center gap-2 bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ocean/90 transition-colors"
            >
              <i className="ri-question-answer-line" />
              {t("help.faqButton")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
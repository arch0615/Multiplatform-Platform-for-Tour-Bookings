import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";

const articles: Record<string, { title: string; content: string[] }> = {
  "como-reservar": {
    title: "help.art1",
    content: [
      "help.art1p1",
      "help.art1p2",
      "help.art1p3",
      "help.art1p4",
      "help.art1p5",
    ],
  },
  "metodos-de-pago": {
    title: "help.art2",
    content: [
      "help.art2p1",
      "help.art2p2",
      "help.art2p3",
      "help.art2p4",
    ],
  },
  "cancelar-reserva": {
    title: "help.art3",
    content: [
      "help.art3p1",
      "help.art3p2",
      "help.art3p3",
    ],
  },
  "registrarme-proveedor": {
    title: "help.art4",
    content: [
      "help.art4p1",
      "help.art4p2",
      "help.art4p3",
      "help.art4p4",
    ],
  },
  reservas: {
    title: "help.catReservas",
    content: [
      "help.catReservasP1",
      "help.catReservasP2",
    ],
  },
  pagos: {
    title: "help.catPagos",
    content: [
      "help.catPagosP1",
      "help.catPagosP2",
    ],
  },
  proveedores: {
    title: "help.catProveedores",
    content: [
      "help.catProveedoresP1",
      "help.catProveedoresP2",
    ],
  },
  cuenta: {
    title: "help.catCuenta",
    content: [
      "help.catCuentaP1",
      "help.catCuentaP2",
    ],
  },
  cancelaciones: {
    title: "help.catCancelaciones",
    content: [
      "help.catCancelacionesP1",
      "help.catCancelacionesP2",
    ],
  },
  seguridad: {
    title: "help.catSeguridad",
    content: [
      "help.catSeguridadP1",
      "help.catSeguridadP2",
    ],
  },
};

export default function HelpArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation("help");

  const article = useMemo(() => (slug ? articles[slug] : undefined), [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
            <i className="ri-file-unknow-line text-4xl" />
          </div>
          <h1 className="text-xl font-bold text-charcoal mb-2">{t("help.articleNotFound")}</h1>
          <Link to="/ayuda" className="inline-flex bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full">
            {t("help.backToHelp")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link to="/ayuda" className="hover:text-ocean transition-colors">{t("help.backToHelp")}</Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-charcoal">{t(article.title)}</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h1 className="font-display text-xl md:text-2xl font-bold text-charcoal mb-6">{t(article.title)}</h1>
            <div className="space-y-4">
              {article.content.map((p, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">{t(p)}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">{t("help.articleHelpful")}</p>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-charcoal hover:bg-gray-50 transition-colors">
                  <i className="ri-thumb-up-line" />
                  {t("help.yes")}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-charcoal hover:bg-gray-50 transition-colors">
                  <i className="ri-thumb-down-line" />
                  {t("help.no")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
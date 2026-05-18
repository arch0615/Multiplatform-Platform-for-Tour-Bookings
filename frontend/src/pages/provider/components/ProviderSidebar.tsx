import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export default function ProviderSidebar() {
  const { t } = useTranslation("provider");
  const location = useLocation();

  const items = [
    { label: t("provider.dashboard"), href: "/proveedor", icon: "ri-dashboard-line" },
    { label: t("provider.products"), href: "/proveedor/productos", icon: "ri-sailboat-line" },
    { label: t("provider.calendar"), href: "/proveedor/calendario", icon: "ri-calendar-line" },
    { label: t("provider.bookings"), href: "/proveedor/reservas", icon: "ri-calendar-check-line" },
    { label: t("provider.reviews"), href: "/proveedor/resenas", icon: "ri-star-line" },
    { label: t("provider.earnings"), href: "/proveedor/ingresos", icon: "ri-money-dollar-circle-line" },
    { label: t("provider.company"), href: "/proveedor/empresa", icon: "ri-building-line" },
    { label: t("provider.notifications"), href: "/proveedor/notificaciones", icon: "ri-notification-3-line" },
    { label: t("provider.settings"), href: "/proveedor/configuracion", icon: "ri-settings-3-line" },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-ocean/10 flex items-center justify-center text-ocean font-bold text-lg shrink-0">
            EP
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal">EcoPaz Tours</p>
            <p className="text-xs text-gray-400">Proveedor verificado</p>
          </div>
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {items.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  active ? "bg-ocean/10 text-ocean" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={item.icon} />
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
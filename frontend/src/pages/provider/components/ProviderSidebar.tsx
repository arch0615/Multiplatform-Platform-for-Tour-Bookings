import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { ProviderStatus, useAuth } from "@/contexts/AuthContext";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export default function ProviderSidebar() {
  const { t } = useTranslation("provider");
  const { user } = useAuth();
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

  const displayName = user?.fullName ?? "—";
  const status = user?.providerStatus;
  const statusLabel =
    status === ProviderStatus.Active
      ? t("provider.verified", { defaultValue: "Proveedor verificado" })
      : status === ProviderStatus.Suspended
        ? t("provider.suspended", { defaultValue: "Cuenta suspendida" })
        : t("provider.pendingVerification", { defaultValue: "Pendiente de verificación" });

  return (
    <aside className="w-full shrink-0 lg:w-72 lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:z-30 lg:overflow-y-auto lg:bg-white lg:border-r lg:border-gray-100 lg:pt-24 lg:px-5 lg:pb-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:bg-transparent lg:rounded-none lg:border-0 lg:p-0 lg:flex lg:flex-col lg:h-full">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 lg:order-2 lg:mt-auto lg:mb-0 lg:pb-0 lg:border-b-0 lg:pt-4 lg:border-t">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-ocean/10 flex items-center justify-center text-ocean font-bold text-lg shrink-0">
              {initialsOf(displayName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-charcoal truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{statusLabel}</p>
          </div>
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:order-1">
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

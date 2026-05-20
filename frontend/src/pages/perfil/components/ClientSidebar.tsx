import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ClientSidebarProps {
  active?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export default function ClientSidebar({ active }: ClientSidebarProps) {
  const { t } = useTranslation("profile");
  const { user } = useAuth();
  const location = useLocation();

  const items = [
    { key: "overview", label: t("profile.overview"), href: "/perfil", icon: "ri-user-line" },
    { key: "bookings", label: t("profile.myBookings"), href: "/perfil/reservas", icon: "ri-calendar-check-line" },
    { key: "favorites", label: t("profile.myFavorites"), href: "/perfil/favoritos", icon: "ri-heart-3-line" },
    { key: "reviews", label: t("profile.myReviews"), href: "/perfil/resenas", icon: "ri-star-line" },
    { key: "payments", label: t("profile.paymentMethods"), href: "/perfil/pagos", icon: "ri-bank-card-line" },
    { key: "notifications", label: t("profile.notifications"), href: "/perfil/notificaciones", icon: "ri-notification-3-line" },
    { key: "security", label: t("profile.security"), href: "/perfil/seguridad", icon: "ri-shield-check-line" },
  ];

  const displayName = user?.fullName ?? "—";
  const subline = user?.email ?? "";

  return (
    <aside className="w-full shrink-0 lg:w-72 lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:z-30 lg:overflow-y-auto lg:bg-white lg:border-r lg:border-gray-100 lg:pt-24 lg:px-5 lg:pb-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:bg-transparent lg:rounded-none lg:border-0 lg:p-0 lg:flex lg:flex-col lg:h-full">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 lg:order-3 lg:mb-0 lg:pb-0 lg:border-b-0 lg:pt-4 lg:border-t">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-ocean/10 flex items-center justify-center text-ocean font-bold text-lg shrink-0">
              {initialsOf(displayName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-charcoal truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{subline}</p>
          </div>
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:order-1">
          {items.map((item) => {
            const isActive = active ? active === item.key : location.pathname === item.href;
            return (
              <Link
                key={item.key}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? "bg-ocean/10 text-ocean" : "text-gray-600 hover:bg-gray-50"
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
        <div className="mt-4 pt-4 border-t border-gray-100 lg:order-2 lg:mt-auto">
          <Link
            to="/perfil/eliminar"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active === "delete" || location.pathname === "/perfil/eliminar"
                ? "bg-coral/10 text-coral"
                : "text-coral hover:bg-coral/5"
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-delete-bin-line" />
            </div>
            {t("profile.deleteAccount")}
          </Link>
        </div>
      </div>
    </aside>
  );
}

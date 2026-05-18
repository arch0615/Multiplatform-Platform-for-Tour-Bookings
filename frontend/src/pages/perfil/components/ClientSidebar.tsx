import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface ClientSidebarProps {
  active: string;
}

export default function ClientSidebar({ active }: ClientSidebarProps) {
  const { t } = useTranslation("profile");

  const items = [
    { key: "overview", label: t("profile.overview"), href: "/perfil", icon: "ri-user-line" },
    { key: "bookings", label: t("profile.myBookings"), href: "/perfil/reservas", icon: "ri-calendar-check-line" },
    { key: "favorites", label: t("profile.myFavorites"), href: "/perfil/favoritos", icon: "ri-heart-3-line" },
    { key: "reviews", label: t("profile.myReviews"), href: "/perfil/resenas", icon: "ri-star-line" },
    { key: "payments", label: t("profile.paymentMethods"), href: "/perfil/pagos", icon: "ri-bank-card-line" },
    { key: "notifications", label: t("profile.notifications"), href: "/perfil/notificaciones", icon: "ri-notification-3-line" },
    { key: "security", label: t("profile.security"), href: "/perfil/seguridad", icon: "ri-shield-check-line" },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-ocean/10 flex items-center justify-center text-ocean font-bold text-lg shrink-0">
            MG
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal">María García</p>
            <p className="text-xs text-gray-400">{t("profile.memberSince")} 2025</p>
          </div>
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {items.map((item) => {
            const isActive = active === item.key;
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
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            to="/perfil/eliminar"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active === "delete" ? "bg-coral/10 text-coral" : "text-coral hover:bg-coral/5"
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
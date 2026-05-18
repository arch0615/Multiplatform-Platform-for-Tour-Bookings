import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: "overview" | "providers" | "bookings" | "reviews" | "coupons" | "settings") => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { t } = useTranslation("admin");

  const items = [
    { key: "overview" as const, label: t("admin.overview"), icon: "ri-dashboard-line" },
    { key: "providers" as const, label: t("admin.providers"), icon: "ri-store-2-line" },
    { key: "bookings" as const, label: t("admin.bookings"), icon: "ri-calendar-check-line" },
    { key: "reviews" as const, label: t("admin.reviews"), icon: "ri-star-line" },
    { key: "coupons" as const, label: t("admin.coupons"), icon: "ri-coupon-line" },
    { key: "settings" as const, label: t("admin.settings"), icon: "ri-settings-3-line" },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center text-coral font-bold text-lg shrink-0">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-shield-user-line" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal">Admin</p>
            <p className="text-xs text-gray-400">{t("admin.title")}</p>
          </div>
        </div>

        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {items.map((item) => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors text-left w-full ${
                  active ? "bg-ocean/10 text-ocean" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={item.icon} />
                </div>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-arrow-left-line" />
            </div>
            Volver al sitio
          </Link>
        </div>
      </div>
    </aside>
  );
}
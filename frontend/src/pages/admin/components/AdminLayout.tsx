import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "ri-dashboard-line" },
  { label: "Proveedores", href: "/admin/proveedores", icon: "ri-store-2-line" },
  { label: "Productos", href: "/admin/productos", icon: "ri-sailboat-line" },
  { label: "Reservas", href: "/admin/reservas", icon: "ri-calendar-check-line" },
  { label: "Usuarios", href: "/admin/usuarios", icon: "ri-user-line" },
  { label: "Comisiones", href: "/admin/comisiones", icon: "ri-percent-line" },
  { label: "Cupones", href: "/admin/cupones", icon: "ri-coupon-line" },
  { label: "Reseñas", href: "/admin/resenas", icon: "ri-star-line" },
  { label: "Categorías", href: "/admin/categorias", icon: "ri-apps-line" },
  { label: "Destinos", href: "/admin/destinos", icon: "ri-map-pin-line" },
  { label: "Reportes", href: "/admin/reportes", icon: "ri-bar-chart-line" },
  { label: "Notificaciones", href: "/admin/notificaciones", icon: "ri-notification-3-line" },
  { label: "Contenido", href: "/admin/contenido", icon: "ri-file-text-line" },
  { label: "Configuración", href: "/admin/configuracion", icon: "ri-settings-3-line" },
  { label: "Auditoría", href: "/admin/auditoria", icon: "ri-shield-check-line" },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center text-coral font-bold text-lg shrink-0">
                    <i className="ri-shield-user-line" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Admin</p>
                    <p className="text-xs text-gray-400">Baja Tours</p>
                  </div>
                </div>
                <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                  {adminNav.map((item) => {
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
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    <div className="w-5 h-5 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
                    Volver al sitio
                  </Link>
                </div>
              </div>
            </aside>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-charcoal mb-6">{title}</h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
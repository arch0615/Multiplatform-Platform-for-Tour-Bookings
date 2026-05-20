import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/feature/UserMenu";

function notificationsHrefFor(pathname: string): string {
  if (pathname.startsWith("/admin")) return "/admin/notificaciones";
  if (pathname.startsWith("/proveedor") || pathname.startsWith("/provider")) return "/proveedor/notificaciones";
  return "/perfil/notificaciones";
}

export default function DashboardTopbar() {
  const { t, i18n } = useTranslation("home");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggleLang = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 md:h-20 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="w-full h-full px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 text-charcoal">
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-sailboat-line text-xl text-turquoise" />
          </div>
          <span className="font-display text-lg md:text-xl font-bold tracking-tight">Baja Tours</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium text-charcoal hover:bg-gray-50 transition-colors"
              aria-label="Language"
            >
              <span>{i18n.language === "es" ? "ES" : "EN"}</span>
              <i className={`ri-arrow-down-s-line ${langOpen ? "rotate-180" : ""} transition-transform`} />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[110px] z-50">
                <button
                  onClick={() => toggleLang("es")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    i18n.language === "es" ? "text-ocean font-semibold" : "text-charcoal"
                  }`}
                >
                  Español
                </button>
                <button
                  onClick={() => toggleLang("en")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    i18n.language === "en" ? "text-ocean font-semibold" : "text-charcoal"
                  }`}
                >
                  English
                </button>
              </div>
            )}
          </div>

          {user && (
            <Link
              to={notificationsHrefFor(location.pathname)}
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-charcoal hover:bg-gray-50 transition-colors"
              aria-label={t("nav.bookings")}
              title={t("nav.bookings")}
            >
              <i className="ri-notification-3-line text-lg" />
            </Link>
          )}

          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex text-sm font-medium text-charcoal hover:text-turquoise transition-colors px-3 py-1.5"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/registro"
                className="bg-ocean hover:bg-ocean/90 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                {t("nav.register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

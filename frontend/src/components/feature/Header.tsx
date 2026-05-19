import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserRole, useAuth, type AuthUser } from "@/contexts/AuthContext";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function UserMenu({ user, onLogout }: { user: AuthUser; onLogout: () => Promise<void> }) {
  const { t } = useTranslation("home");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-gray-200/70 hover:border-ocean/40 transition-colors"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-ocean text-white text-xs font-semibold flex items-center justify-center">
            {initialsOf(user.fullName)}
          </div>
        )}
        <span className="hidden md:inline text-sm font-medium max-w-[140px] truncate">
          {user.fullName.split(" ")[0]}
        </span>
        <i className={`ri-arrow-down-s-line text-base ${open ? "rotate-180" : ""} transition-transform`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 min-w-[220px] text-charcoal">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            to="/perfil"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
          >
            <i className="ri-user-line text-gray-400" /> {t("nav.myAccount")}
          </Link>
          <Link
            to="/perfil/reservas"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
          >
            <i className="ri-calendar-check-line text-gray-400" /> {t("nav.bookings")}
          </Link>

          {user.role === UserRole.Provider && (
            <Link
              to="/proveedor"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
            >
              <i className="ri-store-2-line text-gray-400" /> {t("nav.providerPanel")}
            </Link>
          )}
          {user.role === UserRole.Admin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
            >
              <i className="ri-shield-user-line text-gray-400" /> {t("nav.adminPanel")}
            </Link>
          )}

          <div className="border-t border-gray-100 mt-1">
            <button
              onClick={async () => {
                setOpen(false);
                await onLogout();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-coral hover:bg-coral/5"
            >
              <i className="ri-logout-box-r-line" /> {t("nav.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { t, i18n } = useTranslation("home");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  const navLinks = [
    { label: t("nav.tours"), href: "/tours" },
    { label: t("nav.transportes"), href: "/tours?category=Transporte" },
    { label: t("nav.hospedaje"), href: "/tours?category=Renta+de+Casas" },
    { label: t("nav.experiencias"), href: "/tours" },
    { label: t("nav.paraProveedores"), href: "/proveedores" },
  ];

  const toggleLang = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent text-white"
          : "bg-white/95 backdrop-blur-sm text-charcoal shadow-sm"
      }`}
    >
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 flex items-center justify-center">
              <i className="ri-sailboat-line text-xl text-turquoise" />
            </div>
            <span className="font-display text-xl md:text-2xl font-bold tracking-tight">
              Baja Tours
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium hover:text-turquoise transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm font-medium hover:text-turquoise transition-colors whitespace-nowrap"
              >
                <span>{i18n.language === "es" ? "ES" : "EN"}</span>
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`ri-arrow-down-s-line ${langOpen ? "rotate-180" : ""} transition-transform`} />
                </div>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[80px]">
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

            {user ? (
              <UserMenu user={user} onLogout={handleLogout} />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-turquoise transition-colors whitespace-nowrap"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/registro"
                  className="bg-ocean hover:bg-ocean/90 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <i className={`ri-${mobileOpen ? "close" : "menu"}-line text-xl`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-charcoal text-sm font-medium py-2 hover:text-turquoise transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => toggleLang("es")}
                className={`text-sm font-medium px-3 py-1.5 rounded-full border ${
                  i18n.language === "es"
                    ? "border-ocean text-ocean"
                    : "border-gray-200 text-charcoal"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => toggleLang("en")}
                className={`text-sm font-medium px-3 py-1.5 rounded-full border ${
                  i18n.language === "en"
                    ? "border-ocean text-ocean"
                    : "border-gray-200 text-charcoal"
                }`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 py-2">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-ocean text-white text-sm font-semibold flex items-center justify-center">
                      {initialsOf(user.fullName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                <Link
                  to="/perfil"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-charcoal py-2 hover:text-turquoise transition-colors"
                >
                  {t("nav.myAccount")}
                </Link>
                <Link
                  to="/perfil/reservas"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-charcoal py-2 hover:text-turquoise transition-colors"
                >
                  {t("nav.bookings")}
                </Link>
                {user.role === UserRole.Provider && (
                  <Link
                    to="/proveedor"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-charcoal py-2 hover:text-turquoise transition-colors"
                  >
                    {t("nav.providerPanel")}
                  </Link>
                )}
                {user.role === UserRole.Admin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-charcoal py-2 hover:text-turquoise transition-colors"
                  >
                    {t("nav.adminPanel")}
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await handleLogout();
                  }}
                  className="text-left text-sm text-coral py-2"
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-charcoal text-sm font-medium py-2.5 border border-gray-200 rounded-full"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/registro"
                  onClick={() => setMobileOpen(false)}
                  className="text-center bg-ocean text-white text-sm font-medium py-2.5 rounded-full"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

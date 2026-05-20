import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserRole, type AuthUser } from "@/contexts/AuthContext";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

type Props = {
  user: AuthUser;
  onLogout: () => Promise<void>;
};

export default function UserMenu({ user, onLogout }: Props) {
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
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 min-w-[220px] text-charcoal z-50">
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

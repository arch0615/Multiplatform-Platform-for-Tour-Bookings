import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ClientSidebar from "./components/ClientSidebar";
import { tours } from "@/mocks/tours";
import { onTourImageError } from "@/lib/imageFallback";

const mockBookings = [
  { id: "BK-001", tourId: 1, tourTitle: "Snorkel con tiburón ballena", date: "2026-05-20", adults: 2, children: 1, total: 5400, status: "confirmed", image: tours[0].image },
  { id: "BK-002", tourId: 3, tourTitle: "Tour gastronómico La Paz", date: "2026-04-15", adults: 2, children: 0, total: 2400, status: "completed", image: tours[2].image },
  { id: "BK-003", tourId: 5, tourTitle: "City tour histórico", date: "2026-06-10", adults: 1, children: 0, total: 800, status: "pending", image: tours[4].image },
];

const mockFavorites = [tours[0], tours[6], tours[10]];

export default function PerfilPage() {
  const { t, i18n } = useTranslation("profile");
  const navigate = useNavigate();
  const [profile] = useState({
    fullName: "María García",
    email: "maria@ejemplo.com",
    phone: "+52 612 234 5678",
    location: "La Paz, B.C.S.",
  });

  const statusColor = (s: string) => {
    if (s === "confirmed") return "bg-ocean/10 text-ocean";
    if (s === "pending") return "bg-sand/60 text-charcoal";
    if (s === "completed") return "bg-gray-100 text-gray-600";
    return "bg-coral/10 text-coral";
  };

  const statusLabel = (s: string) => {
    if (s === "confirmed") return t("profile.statusConfirmed");
    if (s === "pending") return t("profile.statusPending");
    if (s === "completed") return t("profile.statusCompleted");
    return t("profile.statusCancelled");
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="overview" />
            <div className="flex-1 min-w-0 space-y-6">
              {/* Profile card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="w-20 h-20 rounded-full bg-ocean/10 flex items-center justify-center text-ocean text-2xl font-bold shrink-0">
                    MG
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold text-charcoal">{profile.fullName}</h1>
                    <p className="text-sm text-gray-500">{profile.email} · {profile.location}</p>
                    <p className="text-xs text-gray-400 mt-1">{t("profile.memberSince")} 2025</p>
                  </div>
                  <button
                    onClick={() => navigate("/perfil/editar")}
                    className="border border-gray-200 text-charcoal text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    {t("profile.editProfile")}
                  </button>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: t("profile.statsBookings"), value: "12", icon: "ri-calendar-check-line", color: "bg-ocean/10 text-ocean" },
                  { label: t("profile.statsFavorites"), value: "3", icon: "ri-heart-3-line", color: "bg-coral/10 text-coral" },
                  { label: t("profile.statsReviews"), value: "5", icon: "ri-star-line", color: "bg-sand/60 text-charcoal" },
                  { label: t("profile.statsSavings"), value: "$2,400", icon: "ri-money-dollar-circle-line", color: "bg-turquoise/10 text-turquoise" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${s.color} mb-2`}>
                      <i className={`${s.icon} text-base`} />
                    </div>
                    <p className="text-lg font-bold text-charcoal">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent bookings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-charcoal">{t("profile.recentBookings")}</h2>
                  <Link to="/perfil/reservas" className="text-sm text-ocean hover:underline">{t("profile.viewAll")}</Link>
                </div>
                <div className="space-y-4">
                  {mockBookings.slice(0, 2).map((b) => (
                    <div key={b.id} className="flex flex-col sm:flex-row gap-4 p-3 bg-gray-50 rounded-xl">
                      <img src={b.image} alt={b.tourTitle} onError={onTourImageError} className="w-full sm:w-28 h-20 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-charcoal truncate">{b.tourTitle}</h3>
                          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(b.status)}`}>
                            {statusLabel(b.status)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><i className="ri-calendar-line" /> {b.date}</span>
                          <span className="flex items-center gap-1"><i className="ri-user-line" /> {b.adults + b.children} {t("profile.guests")}</span>
                          <span className="flex items-center gap-1"><i className="ri-money-dollar-circle-line" /> ${b.total.toLocaleString(i18n.language === "es" ? "es-MX" : "en-US")} MXN</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Favorites preview */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-charcoal">{t("profile.favorites")}</h2>
                  <Link to="/perfil/favoritos" className="text-sm text-ocean hover:underline">{t("profile.viewAll")}</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {mockFavorites.map((tour) => (
                    <Link to={`/tours/${tour.slug}`} key={tour.id} className="group">
                      <div className="relative rounded-xl overflow-hidden mb-2">
                        <img src={tour.image} alt={tour.title} onError={onTourImageError} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h3 className="text-sm font-semibold text-charcoal truncate">{tour.title}</h3>
                      <p className="text-xs text-gray-500">{tour.location}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
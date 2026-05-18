import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { tours } from "@/mocks/tours";

const mockBookings = [
  { id: "BK-001", tourId: 1, tourTitle: "Snorkel con tiburón ballena", date: "2026-05-20", adults: 2, children: 1, total: 5400, status: "confirmed", image: tours[0].image },
  { id: "BK-002", tourId: 3, tourTitle: "Tour gastronómico La Paz", date: "2026-04-15", adults: 2, children: 0, total: 2400, status: "completed", image: tours[2].image },
  { id: "BK-003", tourId: 5, tourTitle: "City tour histórico", date: "2026-06-10", adults: 1, children: 0, total: 800, status: "pending", image: tours[4].image },
];

const mockFavorites = [tours[0], tours[6], tours[10]];

export default function ProfilePage() {
  const { t, i18n } = useTranslation("profile");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"bookings" | "favorites" | "settings">("bookings");
  const [bookingFilter, setBookingFilter] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "María García",
    email: "maria@ejemplo.com",
    phone: "+52 612 234 5678",
    bio: "Amante de los viajes y la naturaleza. Siempre buscando nuevas aventuras en Baja California Sur.",
    location: "La Paz, B.C.S.",
  });

  const filteredBookings = mockBookings.filter((b) => {
    if (bookingFilter === "upcoming") return b.status === "confirmed" || b.status === "pending";
    if (bookingFilter === "past") return b.status === "completed";
    return b.status === "cancelled";
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
          {/* Profile header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 rounded-full bg-ocean/10 flex items-center justify-center text-ocean text-2xl font-bold shrink-0">
                MG
              </div>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-charcoal">{profile.fullName}</h1>
                <p className="text-sm text-gray-500">{profile.email} · {profile.location}</p>
                <p className="text-xs text-gray-400 mt-1">{t("profile.memberSince")} 2025</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="border border-gray-200 text-charcoal text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {isEditing ? t("profile.cancel") : t("profile.editProfile")}
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="border border-gray-200 text-coral text-sm font-medium px-4 py-2 rounded-full hover:bg-coral/5 transition-colors whitespace-nowrap"
                >
                  {t("profile.logout")}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {(["bookings", "favorites", "settings"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab ? "bg-ocean text-white" : "bg-white border border-gray-200 text-charcoal hover:bg-gray-50"
                }`}
              >
                {t(`profile.${tab}`)}
              </button>
            ))}
          </div>

          {/* Bookings tab */}
          {activeTab === "bookings" && (
            <div>
              <div className="flex gap-2 mb-4">
                {(["upcoming", "past", "cancelled"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      bookingFilter === f ? "bg-charcoal text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {t(`profile.${f}`)}
                  </button>
                ))}
              </div>

              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <i className="ri-calendar-line text-3xl" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{t("profile.noBookings")}</p>
                  <Link to="/tours" className="inline-flex bg-ocean text-white text-sm font-medium px-5 py-2 rounded-full">
                    {t("profile.exploreTours")}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((b) => (
                    <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 flex flex-col sm:flex-row gap-4">
                      <img src={b.image} alt={b.tourTitle} className="w-full sm:w-32 h-24 object-cover rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-base font-semibold text-charcoal truncate">{b.tourTitle}</h3>
                          <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(b.status)}`}>
                            {statusLabel(b.status)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-calendar-line text-xs" /></div>
                            {b.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-user-line text-xs" /></div>
                            {b.adults + b.children} {t("profile.guests")}
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-money-dollar-circle-line text-xs" /></div>
                            ${b.total.toLocaleString(i18n.language === "es" ? "es-MX" : "en-US")} MXN
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs font-medium text-ocean hover:underline">{t("profile.viewDetails")}</button>
                          {b.status === "completed" && (
                            <button className="text-xs font-medium text-ocean hover:underline">{t("profile.bookAgain")}</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favorites tab */}
          {activeTab === "favorites" && (
            <div>
              {mockFavorites.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <i className="ri-heart-3-line text-3xl" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{t("profile.noFavorites")}</p>
                  <Link to="/tours" className="inline-flex bg-ocean text-white text-sm font-medium px-5 py-2 rounded-full">
                    {t("profile.exploreTours")}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockFavorites.map((tour) => (
                    <div key={tour.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      <div className="relative">
                        <img src={tour.image} alt={tour.title} className="w-full h-40 object-cover" />
                        <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-coral">
                          <i className="ri-heart-3-fill" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-charcoal mb-1 truncate">{tour.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-map-pin-line" /></div>
                          {tour.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-ocean">${tour.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">MXN</span></span>
                          <Link to={`/tours/${tour.slug}`} className="text-xs font-medium text-ocean hover:underline">{t("profile.viewDetails")}</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-charcoal mb-6">{t("profile.settings")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.fullName")}</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.email")}</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.phone")}</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.location")}</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.bio")}</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ocean/90 transition-colors">
                  {t("profile.save")}
                </button>
                <button className="border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                  {t("profile.cancel")}
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-base font-bold text-charcoal mb-4">{t("profile.password")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.currentPassword")}</label>
                    <input type="password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div />
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.newPassword")}</label>
                    <input type="password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.confirmPassword")}</label>
                    <input type="password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                </div>
                <button className="bg-charcoal text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-charcoal/90 transition-colors">
                  {t("profile.save")}
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-base font-bold text-coral mb-2">{t("profile.deleteAccount")}</h3>
                <p className="text-sm text-gray-500 mb-4">{t("profile.deleteWarning")}</p>
                <button className="border border-coral text-coral text-sm font-medium px-6 py-2.5 rounded-full hover:bg-coral/5 transition-colors">
                  {t("profile.deleteAccount")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
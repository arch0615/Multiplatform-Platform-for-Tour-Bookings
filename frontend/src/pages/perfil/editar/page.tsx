import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientSidebar from "../components/ClientSidebar";

export default function PerfilEditarPage() {
  const { t } = useTranslation("profile");
  const [profile, setProfile] = useState({
    fullName: "María García",
    email: "maria@ejemplo.com",
    phone: "+52 612 234 5678",
    bio: "Amante de los viajes y la naturaleza. Siempre buscando nuevas aventuras en Baja California Sur.",
    location: "La Paz, B.C.S.",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="overview" />
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-xl font-bold text-charcoal">{t("profile.editProfile")}</h1>
                  {saved && (
                    <span className="text-xs font-medium text-ocean bg-ocean/10 px-3 py-1 rounded-full">{t("profile.saved")}</span>
                  )}
                </div>
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
                  <button onClick={handleSave} className="bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ocean/90 transition-colors">
                    {t("profile.save")}
                  </button>
                  <Link to="/perfil" className="border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                    {t("profile.cancel")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
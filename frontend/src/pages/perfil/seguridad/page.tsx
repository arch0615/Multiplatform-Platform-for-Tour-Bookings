import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientSidebar from "../components/ClientSidebar";

export default function PerfilSeguridadPage() {
  const { t } = useTranslation("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
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
            <ClientSidebar active="security" />
            <div className="flex-1 min-w-0 space-y-6">
              {/* Change Password */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-charcoal">{t("profile.changePassword")}</h2>
                  {saved && <span className="text-xs font-medium text-ocean bg-ocean/10 px-3 py-1 rounded-full">{t("profile.saved")}</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.currentPassword")}</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.newPassword")}</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("profile.confirmPassword")}</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                </div>
                <button onClick={handleSave} className="mt-6 bg-charcoal text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-charcoal/90 transition-colors">
                  {t("profile.save")}
                </button>
              </div>

              {/* 2FA */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-charcoal">{t("profile.twoFactor")}</h2>
                    <p className="text-sm text-gray-500">{t("profile.twoFactorDesc")}</p>
                  </div>
                  <button
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${twoFactor ? "bg-ocean" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${twoFactor ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-charcoal mb-4">{t("profile.activeSessions")}</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-ocean/10 text-ocean"><i className="ri-computer-line" /></div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">{t("profile.currentDevice")}</p>
                        <p className="text-xs text-gray-400">Chrome · La Paz, México</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-ocean bg-ocean/10 px-2 py-1 rounded-full">{t("profile.activeNow")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
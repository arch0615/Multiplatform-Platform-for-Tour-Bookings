import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientSidebar from "../components/ClientSidebar";

export default function PerfilEliminarPage() {
  const { t } = useTranslation("profile");
  const [confirmed, setConfirmed] = useState(false);
  const [reason, setReason] = useState("");
  const [step, setStep] = useState<"confirm" | "reason" | "done">("confirm");

  const handleDelete = () => {
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="delete" />
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                {step === "confirm" && (
                  <>
                    <div className="w-14 h-14 flex items-center justify-center bg-coral/10 rounded-full mb-4">
                      <i className="ri-alert-line text-2xl text-coral" />
                    </div>
                    <h1 className="text-xl font-bold text-charcoal mb-2">{t("profile.deleteTitle")}</h1>
                    <p className="text-sm text-gray-500 mb-6">{t("profile.deleteWarning")}</p>
                    <ul className="space-y-2 text-sm text-gray-600 mb-6">
                      <li className="flex items-start gap-2"><i className="ri-close-line text-coral mt-0.5" /> {t("profile.deleteLoss1")}</li>
                      <li className="flex items-start gap-2"><i className="ri-close-line text-coral mt-0.5" /> {t("profile.deleteLoss2")}</li>
                      <li className="flex items-start gap-2"><i className="ri-close-line text-coral mt-0.5" /> {t("profile.deleteLoss3")}</li>
                    </ul>
                    <div className="flex gap-3">
                      <button onClick={() => setStep("reason")} className="bg-coral text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-coral/90 transition-colors">
                        {t("profile.continueDelete")}
                      </button>
                      <Link to="/perfil" className="border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                        {t("profile.cancel")}
                      </Link>
                    </div>
                  </>
                )}

                {step === "reason" && (
                  <>
                    <h1 className="text-xl font-bold text-charcoal mb-2">{t("profile.deleteReasonTitle")}</h1>
                    <p className="text-sm text-gray-500 mb-4">{t("profile.deleteReasonDesc")}</p>
                    <div className="space-y-2 mb-4">
                      {[
                        t("profile.reason1"),
                        t("profile.reason2"),
                        t("profile.reason3"),
                        t("profile.reason4"),
                      ].map((r) => (
                        <label key={r} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                          <input type="radio" name="reason" value={r} onChange={() => setReason(r)} className="accent-coral" />
                          <span className="text-sm text-charcoal">{r}</span>
                        </label>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 mb-6">
                      <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="accent-coral" />
                      <span className="text-sm text-gray-600">{t("profile.deleteConfirm")}</span>
                    </label>
                    <div className="flex gap-3">
                      <button onClick={handleDelete} disabled={!confirmed || !reason} className="bg-coral text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-coral/90 transition-colors disabled:opacity-50">
                        {t("profile.deleteAccountBtn")}
                      </button>
                      <Link to="/perfil" className="border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                        {t("profile.cancel")}
                      </Link>
                    </div>
                  </>
                )}

                {step === "done" && (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 flex items-center justify-center bg-ocean/10 rounded-full mx-auto mb-4">
                      <i className="ri-checkbox-circle-line text-2xl text-ocean" />
                    </div>
                    <h1 className="text-xl font-bold text-charcoal mb-2">{t("profile.deleteDoneTitle")}</h1>
                    <p className="text-sm text-gray-500 mb-6">{t("profile.deleteDoneDesc")}</p>
                    <Link to="/" className="inline-block bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full">
                      {t("profile.backHome")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
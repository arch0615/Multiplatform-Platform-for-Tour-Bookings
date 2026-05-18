import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const steps = [
  { num: 1, title: "Datos de la empresa", desc: "Nombre, RFC, dirección fiscal" },
  { num: 2, title: "Verificación", desc: "INE, comprobante de domicilio, CURP" },
  { num: 3, title: "Cuenta bancaria", desc: "CLABE para recibir pagos" },
  { num: 4, title: "Primer tour", desc: "Crea tu primer producto" },
];

export default function ProveedorOnboardingPage() {
  const { t } = useTranslation("provider");
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">{t("provider.welcome")}</h1>
            <p className="text-sm text-gray-500">{t("provider.onboardingDesc")}</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${step >= s.num ? "bg-ocean text-white" : "bg-gray-100 text-gray-400"}`}>
                  {step > s.num ? <i className="ri-check-line" /> : s.num}
                </div>
                {s.num < steps.length && <div className={`w-8 h-px ${step > s.num ? "bg-ocean" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-charcoal">{steps[0].title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.companyName")}</label><input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" /></div>
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">RFC</label><input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.companyAddress")}</label><input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" /></div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-charcoal">{steps[1].title}</h2>
                <div className="space-y-4">
                  {["INE", "Comprobante de domicilio", "CURP"].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm text-charcoal">{doc}</span>
                      <button className="text-xs bg-ocean text-white px-3 py-1.5 rounded-full">{t("provider.upload")}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-charcoal">{steps[2].title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.bank")}</label><input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" /></div>
                  <div><label className="block text-sm font-medium text-charcoal mb-1.5">CLABE</label><input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" /></div>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 flex items-center justify-center bg-ocean/10 rounded-full mx-auto mb-4">
                  <i className="ri-checkbox-circle-line text-3xl text-ocean" />
                </div>
                <h2 className="text-lg font-bold text-charcoal mb-2">{t("provider.onboardingComplete")}</h2>
                <p className="text-sm text-gray-500 mb-6">{t("provider.onboardingCompleteDesc")}</p>
                <button onClick={() => navigate("/proveedor/productos/nuevo")} className="bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full">
                  {t("provider.createFirstTour")}
                </button>
              </div>
            )}

            {step < 4 && (
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="flex-1 border border-gray-200 text-charcoal font-medium py-2.5 rounded-full hover:bg-gray-50">
                    {t("provider.back")}
                  </button>
                )}
                <button onClick={() => setStep(step + 1)} className="flex-1 bg-ocean text-white font-medium py-2.5 rounded-full hover:bg-ocean/90">
                  {t("provider.continue")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
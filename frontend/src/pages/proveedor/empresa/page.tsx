import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../../provider/components/ProviderSidebar";

export default function ProveedorEmpresaPage() {
  const { t } = useTranslation("provider");
  const [company, setCompany] = useState({
    name: "EcoPaz Tours",
    rfc: "EPT123456ABC",
    address: "Calle Álvaro Obregón 123, La Paz, B.C.S.",
    phone: "+52 612 123 4567",
    email: "hola@ecopaz.mx",
    website: "https://ecopaz.mx",
    description: "Tours ecológicos y de aventura en Baja California Sur. Especialistas en snorkel, kayak y avistamiento de ballenas.",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-xl font-bold text-charcoal">{t("provider.companyProfile")}</h1>
                  {saved && <span className="text-xs font-medium text-ocean bg-ocean/10 px-3 py-1 rounded-full">{t("provider.saved")}</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.companyName")}</label>
                    <input type="text" value={company.name} onChange={(e) => setCompany((c) => ({ ...c, name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">RFC</label>
                    <input type="text" value={company.rfc} onChange={(e) => setCompany((c) => ({ ...c, rfc: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.companyAddress")}</label>
                    <input type="text" value={company.address} onChange={(e) => setCompany((c) => ({ ...c, address: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.phone")}</label>
                    <input type="tel" value={company.phone} onChange={(e) => setCompany((c) => ({ ...c, phone: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
                    <input type="email" value={company.email} onChange={(e) => setCompany((c) => ({ ...c, email: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.website")}</label>
                    <input type="url" value={company.website} onChange={(e) => setCompany((c) => ({ ...c, website: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.description")}</label>
                    <textarea value={company.description} onChange={(e) => setCompany((c) => ({ ...c, description: e.target.value }))} rows={4} maxLength={500} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSave} className="bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ocean/90 transition-colors">{t("provider.save")}</button>
                </div>
              </div>

              {/* Verification */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-charcoal mb-4">{t("provider.verification")}</h2>
                <div className="space-y-3">
                  {[
                    { label: "INE", status: "verified" },
                    { label: "Comprobante de domicilio", status: "verified" },
                    { label: "CURP", status: "verified" },
                    { label: "Acta constitutiva", status: "pending" },
                  ].map((doc) => (
                    <div key={doc.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-charcoal">{doc.label}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${doc.status === "verified" ? "bg-ocean/10 text-ocean" : "bg-sand/60 text-charcoal"}`}>
                        {doc.status === "verified" ? "Verificado" : "Pendiente"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank account */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-charcoal mb-4">{t("provider.bankAccount")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider.bank")}</label>
                    <input type="text" defaultValue="BBVA" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">CLABE</label>
                    <input type="text" defaultValue="012345678901234567" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean font-mono" />
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
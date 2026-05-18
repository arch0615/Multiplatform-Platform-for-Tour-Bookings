import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState({
    platformName: "Baja Tours",
    contactEmail: "hola@bajatours.mx",
    commissionRate: 15,
    currency: "MXN",
    language: "es",
    autoConfirm: true,
    cancellationPeriod: 24,
    maxGuests: 20,
  });

  return (
    <AdminLayout title="Configuración">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
          <h2 className="text-base font-bold text-charcoal mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Nombre de la plataforma</label>
              <input type="text" value={settings.platformName} onChange={(e) => setSettings((s) => ({ ...s, platformName: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email de contacto</label>
              <input type="email" value={settings.contactEmail} onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Moneda</label>
                <select value={settings.currency} onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean bg-white">
                  <option value="MXN">MXN — Peso mexicano</option>
                  <option value="USD">USD — US Dollar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Idioma por defecto</label>
                <select value={settings.language} onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean bg-white">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
          <h2 className="text-base font-bold text-charcoal mb-4">Reservas</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">Auto-confirmar reservas</p>
                <p className="text-xs text-gray-400">Las reservas se confirman automáticamente</p>
              </div>
              <button className="relative w-11 h-6 bg-ocean rounded-full">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Periodo de cancelación gratuita</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={settings.cancellationPeriod} className="w-24 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
                  <span className="text-sm text-gray-500">horas antes</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Máximo de huéspedes por reserva</label>
                <input type="number" value={settings.maxGuests} className="w-24 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ocean/90 transition-colors">
            <i className="ri-save-line" /> Guardar cambios
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminSidebar from "./components/AdminSidebar";

const kpiData = [
  { label: "Ventas totales", value: "$128,450", icon: "ri-money-dollar-circle-line", color: "bg-ocean/10 text-ocean" },
  { label: "Proveedores activos", value: "24", icon: "ri-store-2-line", color: "bg-turquoise/10 text-turquoise" },
  { label: "Clientes registrados", value: "1,847", icon: "ri-user-line", color: "bg-sand/60 text-charcoal" },
  { label: "Tours activos", value: "86", icon: "ri-sailboat-line", color: "bg-coral/10 text-coral" },
];

const providers = [
  { id: 1, name: "EcoPaz Tours", email: "hola@ecopaz.mx", status: "active", verified: true, tours: 6, revenue: "$45,200" },
  { id: 2, name: "Baja Aventuras", email: "info@bajaaventuras.com", status: "active", verified: true, tours: 8, revenue: "$38,100" },
  { id: 3, name: "Cabo Expeditions", email: "reservas@caboexp.com", status: "pending", verified: false, tours: 3, revenue: "$0" },
  { id: 4, name: "La Paz Gastro", email: "contacto@lapazgastro.mx", status: "active", verified: true, tours: 4, revenue: "$12,400" },
];

const recentBookings = [
  { id: "BK-210", customer: "María García", tour: "Snorkel con tiburón ballena", provider: "EcoPaz Tours", date: "2026-05-20", total: 5400, status: "confirmed" },
  { id: "BK-209", customer: "John Smith", tour: "Paseo en kayak bioluminiscente", provider: "Baja Aventuras", date: "2026-05-19", total: 3000, status: "confirmed" },
  { id: "BK-208", customer: "Laura Martínez", tour: "City tour histórico", provider: "EcoPaz Tours", date: "2026-05-18", total: 800, status: "completed" },
  { id: "BK-207", customer: "Carlos Ruiz", tour: "Pesca deportiva marlín", provider: "Baja Aventuras", date: "2026-05-17", total: 18000, status: "completed" },
];

const recentReviews = [
  { id: 1, tour: "Snorkel con tiburón ballena", user: "Ana López", rating: 5, comment: "Experiencia increíble, altamente recomendado", date: "2026-05-15" },
  { id: 2, tour: "Tour gastronómico La Paz", user: "Pedro Gómez", rating: 4, comment: "Muy buena comida, excelente guía", date: "2026-05-14" },
  { id: 3, tour: "Avistamiento de ballenas", user: "Sofía Hernández", rating: 5, comment: "Un sueño hecho realidad", date: "2026-05-13" },
];

const coupons = [
  { id: 1, code: "BAJA10", discount: "10%", expiry: "2026-06-30", usage: 45 },
  { id: 2, code: "VERANO2026", discount: "$500 MXN", expiry: "2026-08-31", usage: 12 },
  { id: 3, code: "FAMILIA", discount: "15%", expiry: "2026-07-15", usage: 8 },
];

export default function AdminDashboard() {
  const { t } = useTranslation("admin");
  const [activeTab, setActiveTab] = useState<"overview" | "providers" | "bookings" | "reviews" | "coupons" | "settings">("overview");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-charcoal mb-6">{t("admin.title")}</h1>

              {/* Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiData.map((kpi) => (
                      <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${kpi.color} mb-3`}>
                          <i className={`${kpi.icon} text-lg`} />
                        </div>
                        <p className="text-2xl font-bold text-charcoal">{kpi.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                    <h2 className="text-base font-bold text-charcoal mb-4">{t("admin.recentBookings")}</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">ID</th>
                            <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Cliente</th>
                            <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tour</th>
                            <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Proveedor</th>
                            <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Total</th>
                            <th className="text-left text-xs font-medium text-gray-400 py-3">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map((b) => (
                            <tr key={b.id} className="border-b border-gray-50 last:border-0">
                              <td className="py-3 pr-4 font-medium text-charcoal">{b.id}</td>
                              <td className="py-3 pr-4 text-gray-600">{b.customer}</td>
                              <td className="py-3 pr-4 text-gray-600 truncate max-w-[140px]">{b.tour}</td>
                              <td className="py-3 pr-4 text-gray-500">{b.provider}</td>
                              <td className="py-3 pr-4 font-medium text-charcoal">${b.total.toLocaleString()}</td>
                              <td className="py-3">
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-ocean/10 text-ocean">
                                  {b.status === "confirmed" ? "Confirmada" : "Completada"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                    <h2 className="text-base font-bold text-charcoal mb-4">{t("admin.recentReviews")}</h2>
                    <div className="space-y-4">
                      {recentReviews.map((r) => (
                        <div key={r.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/10 text-ocean font-bold text-sm shrink-0">
                            {r.user.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-charcoal">{r.user}</span>
                              <div className="flex items-center gap-0.5 text-coral">
                                {Array.from({ length: r.rating }).map((_, i) => (
                                  <i key={i} className="ri-star-fill text-xs" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{r.comment}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{r.tour}</span>
                              <span>·</span>
                              <span>{r.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button className="text-xs text-ocean hover:underline">{t("admin.approveReview")}</button>
                            <button className="text-xs text-coral hover:underline">{t("admin.rejectReview")}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Providers */}
              {activeTab === "providers" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.providerName")}</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.providerEmail")}</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tours</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.providerStatus")}</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.providerVerified")}</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3">{t("admin.providerActions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {providers.map((p) => (
                          <tr key={p.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3 pr-4 font-medium text-charcoal">{p.name}</td>
                            <td className="py-3 pr-4 text-gray-600">{p.email}</td>
                            <td className="py-3 pr-4 text-gray-600">{p.tours}</td>
                            <td className="py-3 pr-4">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status === "active" ? "bg-ocean/10 text-ocean" : "bg-sand/60 text-charcoal"}`}>
                                {p.status === "active" ? "Activo" : "Pendiente"}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              {p.verified ? (
                                <span className="flex items-center gap-1 text-xs text-ocean">
                                  <i className="ri-checkbox-circle-fill" /> Sí
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">No</span>
                              )}
                            </td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                {p.status === "pending" ? (
                                  <>
                                    <button className="text-xs text-ocean hover:underline">{t("admin.approve")}</button>
                                    <button className="text-xs text-coral hover:underline">{t("admin.reject")}</button>
                                  </>
                                ) : (
                                  <button className="text-xs text-coral hover:underline">{t("admin.suspend")}</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bookings */}
              {activeTab === "bookings" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">ID</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Cliente</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Tour</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Proveedor</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Fecha</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">Total</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((b) => (
                          <tr key={b.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3 pr-4 font-medium text-charcoal">{b.id}</td>
                            <td className="py-3 pr-4 text-gray-600">{b.customer}</td>
                            <td className="py-3 pr-4 text-gray-600 truncate max-w-[140px]">{b.tour}</td>
                            <td className="py-3 pr-4 text-gray-500">{b.provider}</td>
                            <td className="py-3 pr-4 text-gray-500">{b.date}</td>
                            <td className="py-3 pr-4 font-medium text-charcoal">${b.total.toLocaleString()}</td>
                            <td className="py-3">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-ocean/10 text-ocean">
                                {b.status === "confirmed" ? "Confirmada" : "Completada"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <div className="space-y-4">
                    {recentReviews.map((r) => (
                      <div key={r.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/10 text-ocean font-bold text-sm shrink-0">
                          {r.user.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-charcoal">{r.user}</span>
                            <div className="flex items-center gap-0.5 text-coral">
                              {Array.from({ length: r.rating }).map((_, i) => (
                                <i key={i} className="ri-star-fill text-xs" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{r.comment}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{r.tour}</span>
                            <span>·</span>
                            <span>{r.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button className="text-xs text-ocean hover:underline">{t("admin.approveReview")}</button>
                          <button className="text-xs text-coral hover:underline">{t("admin.rejectReview")}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coupons */}
              {activeTab === "coupons" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-charcoal">{t("admin.coupons")}</h2>
                    <button className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-medium px-4 py-2 rounded-full">
                      <i className="ri-add-line" />
                      {t("admin.addCoupon")}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.couponCode")}</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.couponDiscount")}</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.couponExpiry")}</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3 pr-4">{t("admin.couponUsage")}</th>
                          <th className="text-left text-xs font-medium text-gray-400 py-3">{t("admin.providerActions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((c) => (
                          <tr key={c.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3 pr-4 font-mono font-medium text-charcoal">{c.code}</td>
                            <td className="py-3 pr-4 text-gray-600">{c.discount}</td>
                            <td className="py-3 pr-4 text-gray-500">{c.expiry}</td>
                            <td className="py-3 pr-4 text-gray-600">{c.usage}</td>
                            <td className="py-3">
                              <button className="text-xs text-coral hover:underline">Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Settings */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* General Settings */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                        <i className="ri-settings-3-line text-lg" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-charcoal">{t("admin.settings")}</h2>
                        <p className="text-xs text-gray-500">{t("admin.settingsDesc")}</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Platform Name */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.platformName")}</label>
                        <input
                          type="text"
                          defaultValue="Baja Tours"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        />
                      </div>

                      {/* Contact Email */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.contactEmail")}</label>
                        <input
                          type="email"
                          defaultValue="hola@bajatours.mx"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        />
                      </div>

                      {/* Commission Rate */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.commissionRate")}</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            defaultValue={15}
                            min={0}
                            max={100}
                            className="w-24 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{t("admin.commissionDesc")}</p>
                      </div>

                      {/* Currency */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.currency")}</label>
                        <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean bg-white">
                          <option value="MXN">MXN — Peso mexicano</option>
                          <option value="USD">USD — US Dollar</option>
                          <option value="EUR">EUR — Euro</option>
                        </select>
                      </div>

                      {/* Default Language */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.defaultLanguage")}</label>
                        <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean bg-white">
                          <option value="es">Español</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Booking Settings */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-coral/10 text-coral">
                        <i className="ri-calendar-check-line text-lg" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-charcoal">{t("admin.bookingSettings")}</h2>
                        <p className="text-xs text-gray-500">{t("admin.bookingSettingsDesc")}</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Auto-confirm bookings */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-charcoal">{t("admin.autoConfirm")}</p>
                          <p className="text-xs text-gray-400">{t("admin.autoConfirmDesc")}</p>
                        </div>
                        <button className="relative w-11 h-6 bg-ocean rounded-full transition-colors">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </button>
                      </div>

                      {/* Free cancellation period */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.cancellationPeriod")}</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            defaultValue={24}
                            min={0}
                            className="w-24 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                          />
                          <span className="text-sm text-gray-500">{t("admin.hoursBefore")}</span>
                        </div>
                      </div>

                      {/* Max guests per booking */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.maxGuests")}</label>
                        <input
                          type="number"
                          defaultValue={20}
                          min={1}
                          className="w-24 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-turquoise/10 text-turquoise">
                        <i className="ri-notification-3-line text-lg" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-charcoal">{t("admin.notificationSettings")}</h2>
                        <p className="text-xs text-gray-500">{t("admin.notificationSettingsDesc")}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: t("admin.emailNewBooking"), desc: t("admin.emailNewBookingDesc"), active: true },
                        { label: t("admin.emailNewProvider"), desc: t("admin.emailNewProviderDesc"), active: true },
                        { label: t("admin.emailNewReview"), desc: t("admin.emailNewReviewDesc"), active: false },
                        { label: t("admin.emailDailyReport"), desc: t("admin.emailDailyReportDesc"), active: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-charcoal">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                          <button
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              item.active ? "bg-ocean" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                item.active ? "right-1" : "left-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-sand/60 text-charcoal">
                        <i className="ri-bank-card-line text-lg" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-charcoal">{t("admin.paymentMethods")}</h2>
                        <p className="text-xs text-gray-500">{t("admin.paymentMethodsDesc")}</p>
                      </div>
                    </div>

                    {/* Mercado Pago */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                          <i className="ri-secure-payment-line text-lg" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{t("admin.mercadoPago")}</p>
                          <p className="text-xs text-gray-400">{t("admin.mercadoPagoDesc")}</p>
                        </div>
                        <button className="relative w-11 h-6 bg-ocean rounded-full transition-colors ml-auto shrink-0">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </button>
                      </div>

                      {/* Public Key */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.mpPublicKey")}</label>
                        <div className="relative">
                          <input
                            type="password"
                            defaultValue="TEST-12345678-1234-1234-1234-123456789012"
                            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean font-mono"
                          />
                          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal">
                            <i className="ri-eye-line" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{t("admin.mpPublicKeyHint")}</p>
                      </div>

                      {/* Access Token */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.mpAccessToken")}</label>
                        <div className="relative">
                          <input
                            type="password"
                            defaultValue="TEST-1234567890123456-123456-1234567890abcdef1234567890abcdef-123456789"
                            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean font-mono"
                          />
                          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal">
                            <i className="ri-eye-line" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{t("admin.mpAccessTokenHint")}</p>
                      </div>

                      {/* Webhook URL */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-1.5">{t("admin.mpWebhookUrl")}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue="https://api.bajatours.mx/webhooks/mercadopago"
                            readOnly
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 font-mono"
                          />
                          <button className="shrink-0 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            <i className="ri-file-copy-line" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{t("admin.mpWebhookHint")}</p>
                      </div>

                      {/* Test / Production toggle */}
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-sm font-medium text-charcoal">{t("admin.mpTestMode")}</p>
                          <p className="text-xs text-gray-400">{t("admin.mpTestModeDesc")}</p>
                        </div>
                        <button className="relative w-11 h-6 bg-ocean rounded-full transition-colors">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                        </button>
                      </div>

                      {/* Connection status */}
                      <div className="flex items-center gap-2 p-3 bg-ocean/5 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-ocean" />
                        <span className="text-sm text-ocean font-medium">{t("admin.mpConnected")}</span>
                        <span className="text-xs text-gray-400 ml-auto">{t("admin.mpLastChecked")}: 2026-05-14</span>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ocean/90 transition-colors">
                      <i className="ri-save-line" />
                      {t("admin.saveSettings")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
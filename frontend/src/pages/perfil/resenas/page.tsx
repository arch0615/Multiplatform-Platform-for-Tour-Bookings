import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientSidebar from "../components/ClientSidebar";

const mockReviews = [
  { id: 1, tour: "Snorkel con tiburón ballena", rating: 5, comment: "Experiencia increíble, altamente recomendado. El guía fue muy profesional.", date: "2026-05-15", provider: "EcoPaz Tours" },
  { id: 2, tour: "Tour gastronómico La Paz", rating: 4, comment: "Muy buena comida, excelente guía. Recomiendo llegar con hambre.", date: "2026-05-14", provider: "La Paz Gastro" },
  { id: 3, tour: "Avistamiento de ballenas", rating: 5, comment: "Un sueño hecho realidad. Vimos ballenas jorobadas de cerca.", date: "2026-05-13", provider: "Baja Aventuras" },
];

export default function PerfilResenasPage() {
  const { t } = useTranslation("profile");
  const [reviews] = useState(mockReviews);

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ClientSidebar active="reviews" />
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h1 className="text-lg font-bold text-charcoal mb-4">{t("profile.myReviews")}</h1>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <i className="ri-star-line text-3xl" />
                    </div>
                    <p className="text-sm text-gray-500">{t("profile.noReviews")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-sm font-semibold text-charcoal">{r.tour}</h3>
                          <div className="flex items-center gap-0.5 text-coral shrink-0">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <i key={i} className="ri-star-fill text-xs" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{r.comment}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{r.provider}</span>
                          <span>·</span>
                          <span>{r.date}</span>
                        </div>
                      </div>
                    ))}
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
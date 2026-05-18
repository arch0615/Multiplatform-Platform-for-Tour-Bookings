import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProviderSidebar from "../../provider/components/ProviderSidebar";

const reviews = [
  { id: 1, tour: "Snorkel con tiburón ballena", user: "Ana López", rating: 5, comment: "Experiencia increíble, altamente recomendado", date: "2026-05-15", replied: false },
  { id: 2, tour: "Tour gastronómico La Paz", user: "Pedro Gómez", rating: 4, comment: "Muy buena comida, excelente guía", date: "2026-05-14", replied: true },
  { id: 3, tour: "Avistamiento de ballenas", user: "Sofía Hernández", rating: 5, comment: "Un sueño hecho realidad", date: "2026-05-13", replied: false },
];

export default function ProveedorResenasPage() {
  const { t } = useTranslation("provider");
  const [replying, setReplying] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-charcoal mb-6">{t("provider.reviewsReceived")}</h1>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start gap-3 mb-3">
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
                      {r.replied && (
                        <span className="shrink-0 text-xs font-medium text-ocean bg-ocean/10 px-2 py-1 rounded-full">{t("provider.replied")}</span>
                      )}
                    </div>
                    {replying === r.id ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          maxLength={500}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean resize-none"
                          placeholder={t("provider.replyPlaceholder")}
                        />
                        <div className="flex gap-2">
                          <button className="bg-ocean text-white text-xs font-medium px-4 py-2 rounded-full">{t("provider.sendReply")}</button>
                          <button onClick={() => setReplying(null)} className="border border-gray-200 text-charcoal text-xs font-medium px-4 py-2 rounded-full">{t("provider.cancel")}</button>
                        </div>
                      </div>
                    ) : (
                      !r.replied && (
                        <button onClick={() => setReplying(r.id)} className="mt-2 text-xs text-ocean hover:underline">
                          {t("provider.reply")}
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
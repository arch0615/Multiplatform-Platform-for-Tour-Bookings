import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PagoProcesandoPage() {
  const { t } = useTranslation("booking");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate redirect to Mercado Pago, then success
      navigate("/reservar/confirmacion/BK-TEST-123");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 flex items-center justify-center bg-ocean/10 rounded-full mx-auto mb-6 animate-pulse">
          <div className="w-8 h-8 border-2 border-ocean/30 border-t-ocean rounded-full animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal mb-2">{t("booking.processingTitle")}</h1>
        <p className="text-sm text-gray-500 mb-8">{t("booking.processingDesc")}</p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><i className="ri-shield-check-line text-ocean" /> {t("booking.secureConnection")}</span>
          <span className="flex items-center gap-1"><i className="ri-lock-line text-ocean" /> SSL</span>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function CookieBanner() {
  const { t } = useTranslation("home");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieAccepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg">
      <div className="w-full px-4 md:px-8 lg:px-12 py-4 md:py-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-charcoal/80 max-w-2xl">
            {t("cookieBanner.text")}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="text-sm text-ocean hover:underline whitespace-nowrap">
              {t("cookieBanner.privacy")}
            </a>
            <button
              onClick={accept}
              className="bg-ocean hover:bg-ocean/90 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors whitespace-nowrap"
            >
              {t("cookieBanner.accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
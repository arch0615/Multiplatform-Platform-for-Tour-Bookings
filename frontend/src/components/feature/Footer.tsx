import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("home");

  return (
    <footer className="bg-ocean text-white">
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-sailboat-line text-xl text-turquoise" />
              </div>
              <span className="font-display text-xl font-bold">Baja Tours</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              {t("footer.desc")}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Instagram">
                <i className="ri-instagram-line" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Facebook">
                <i className="ri-facebook-line" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="YouTube">
                <i className="ri-youtube-line" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">{t("footer.about")}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/nosotros" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.whoWeAre")}</Link></li>
              <li><Link to="/como-funciona" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.team")}</Link></li>
              <li><Link to="/blog" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.blog")}</Link></li>
              <li><Link to="/proveedores" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.press")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">{t("footer.help")}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/ayuda" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.helpCenter")}</Link></li>
              <li><Link to="/ayuda/faq" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.faq")}</Link></li>
              <li><Link to="/politica-cancelacion" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.cancellationPolicy")}</Link></li>
              <li><Link to="/terminos" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.terms")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2.5">
              <li className="text-white/70 text-sm flex items-start gap-2">
                <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                  <i className="ri-mail-line text-xs" />
                </div>
                hola@bajatours.mx
              </li>
              <li className="text-white/70 text-sm flex items-start gap-2">
                <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                  <i className="ri-phone-line text-xs" />
                </div>
                +52 612 123 4567
              </li>
              <li className="text-white/70 text-sm flex items-start gap-2">
                <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                  <i className="ri-map-pin-line text-xs" />
                </div>
                La Paz, B.C.S., México
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-xs">
              © 2026 Baja Tours. {t("footer.rights")}.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-xs">{t("footer.payments")}:</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">VISA</span>
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">MC</span>
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
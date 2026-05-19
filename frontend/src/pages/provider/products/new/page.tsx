import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import ProductForm from "../components/ProductForm";

export default function ProviderProductNewPage() {
  const { t } = useTranslation("provider");
  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20 pb-12">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <ProviderSidebar />
            <div className="flex-1 min-w-0">
              <Link to="/provider/products" className="inline-flex items-center gap-1 text-sm text-ocean mb-4 hover:underline">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-line" /></div>
                {t("provider.backToProducts", { defaultValue: "Volver a productos" })}
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-charcoal mb-6">
                {t("provider.addTour")}
              </h1>
              <ProductForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

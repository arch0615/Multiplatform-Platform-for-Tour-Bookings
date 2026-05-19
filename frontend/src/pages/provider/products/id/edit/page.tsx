import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import ProviderSidebar from "../../../components/ProviderSidebar";
import ProductForm from "../../components/ProductForm";
import { ApiError } from "@/lib/api";
import { getMyTour, type ProviderTour } from "@/lib/providerTours";

export default function ProviderProductEditPage() {
  const { t } = useTranslation("provider");
  const { id } = useParams<{ id: string }>();

  const [tour, setTour] = useState<ProviderTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getMyTour(id)
      .then((tr) => { if (!cancelled) setTour(tr); })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 403)) setNotFound(true);
        setTour(null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

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

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 rounded-full border-2 border-ocean border-t-transparent animate-spin" />
                </div>
              ) : notFound || !tour ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <p className="text-sm text-gray-500">
                    {t("provider.tourNotFound", { defaultValue: "Tour no encontrado." })}
                  </p>
                </div>
              ) : (
                <>
                  <h1 className="text-xl md:text-2xl font-bold text-charcoal mb-2">
                    {t("provider.editTour")}
                  </h1>
                  <p className="text-sm text-gray-500 mb-6">{tour.title}</p>
                  <ProductForm initial={tour} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api";
import { getTourBySlug, getTourReviews, type TourDetail, type TourReview } from "@/lib/tours";
import Gallery from "./components/Gallery";
import BookingForm from "./components/BookingForm";
import Reviews from "./components/Reviews";
import SimilarTours from "./components/SimilarTours";

const categoryLabels = ["Aventura", "Cultural", "Gastronómico", "Transporte", "Renta de Casas", "Pesca"];

function parseItinerary(s: string | null | undefined): Array<{ time: string; label: string }> {
  if (!s) return [];
  return s
    .split(/[·\n]/)
    .map((seg) => seg.trim())
    .filter(Boolean)
    .map((seg) => {
      const match = seg.match(/^(\d{1,2}:\d{2})\s+(.*)$/);
      return match ? { time: match[1]!, label: match[2]! } : { time: "", label: seg };
    });
}

function languageBadges(csv: string): string[] {
  return csv.split(",").map((l) => l.trim().toUpperCase()).filter(Boolean);
}

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation("tour");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [reviews, setReviews] = useState<TourReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    Promise.all([
      getTourBySlug(slug),
      getTourReviews(slug).catch(() => [] as TourReview[]),
    ])
      .then(([detail, revs]) => {
        if (cancelled) return;
        setTour(detail);
        setReviews(revs);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        setTour(null);
        setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  const itinerary = useMemo(() => parseItinerary(tour?.itinerary), [tour?.itinerary]);
  const languages = useMemo(() => (tour ? languageBadges(tour.languages) : []), [tour]);

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-ocean border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !tour) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
            <i className="ri-map-pin-line text-4xl" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-charcoal mb-2">{t("notFound.title")}</h1>
          <p className="text-sm text-gray-500 mb-6">{t("notFound.desc")}</p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-ocean hover:bg-ocean/90 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-left-line" />
            </div>
            {t("notFound.cta")}
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = tour.images.map((i) => i.url);
  const isBestRated = tour.rating >= 4.8 && tour.reviewCount >= 2;
  const categoryLabel = categoryLabels[tour.category] ?? "";

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 pt-4 pb-2">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/tours"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-ocean transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-left-line" />
            </div>
            {t("backToTours")}
          </Link>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto">
          <Gallery images={galleryImages} title={tour.title} />
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-3 mb-2">
            {isBestRated && (
              <span className="shrink-0 bg-ocean text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {t("bestRated")}
              </span>
            )}
            <div className="flex flex-wrap gap-1.5">
              {languages.map((lang) => (
                <span key={lang} className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-xl md:text-3xl font-bold text-charcoal mb-2">{tour.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 flex items-center justify-center text-coral">
                <i className="ri-star-fill text-xs" />
              </div>
              <span className="font-semibold text-charcoal">{tour.rating.toFixed(1)}</span>
              <span>({tour.reviewCount} {t("reviews")})</span>
            </div>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-map-pin-line" />
              </div>
              <span>{tour.location}</span>
            </div>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-time-line" />
              </div>
              <span>{tour.duration}</span>
            </div>
            {categoryLabel && (
              <>
                <span className="hidden sm:inline">·</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-price-tag-3-line" />
                  </div>
                  <span>{categoryLabel}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 pb-10 md:pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1 min-w-0 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-charcoal mb-4">
                  {t("description.title")}
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {tour.description}
                </div>
              </div>

              {itinerary.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-charcoal mb-4">
                    {t("itinerary.title")}
                  </h3>
                  <div className="space-y-4">
                    {itinerary.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-ocean/10 text-ocean text-xs font-bold">
                            {i + 1}
                          </div>
                          {i < itinerary.length - 1 && (
                            <div className="w-px flex-1 bg-gray-100 my-1" />
                          )}
                        </div>
                        <div className="pb-4">
                          {item.time && (
                            <span className="text-xs font-medium text-ocean bg-ocean/10 px-2 py-0.5 rounded mr-2">
                              {item.time}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-charcoal">{item.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tour.meetingPoint && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-charcoal mb-3">
                    {t("info.meetingPoint")}
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/10 text-ocean shrink-0">
                      <i className="ri-map-pin-line text-lg" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{tour.meetingPoint}</p>
                  </div>
                </div>
              )}

              <Reviews
                reviews={reviews}
                overallRating={tour.rating}
                reviewCount={tour.reviewCount}
              />

              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-charcoal mb-4">
                  {t("provider.title")}
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-coral/10 text-coral text-base font-semibold flex items-center justify-center shrink-0">
                    {tour.provider.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-semibold text-charcoal">{tour.provider.companyName}</span>
                      {tour.provider.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-ocean bg-ocean/10 px-2 py-0.5 rounded-full">
                          <div className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-checkbox-circle-fill" />
                          </div>
                          {t("provider.verified")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-ocean">
                      ${tour.priceAdult.toLocaleString(priceLocale)}
                    </span>
                    <span className="text-sm text-gray-500">MXN</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{t("perPerson")}</p>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">{t("info.duration")}</span>
                      <span className="font-medium text-charcoal">{tour.duration}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">{t("info.language")}</span>
                      <span className="font-medium text-charcoal">{languages.join(", ")}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">{t("info.maxGuests")}</span>
                      <span className="font-medium text-charcoal">{tour.maxGuests} {t("booking.guests")}</span>
                    </div>
                    {categoryLabel && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-500">{t("info.category")}</span>
                        <span className="font-medium text-charcoal">{categoryLabel}</span>
                      </div>
                    )}
                  </div>
                </div>

                <BookingForm
                  slug={tour.slug}
                  price={tour.priceAdult}
                  childPrice={tour.priceChild}
                  maxGuests={tour.maxGuests}
                  priceLocale={priceLocale}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimilarTours currentSlug={tour.slug} category={tour.category} priceLocale={priceLocale} />
    </div>
  );
}

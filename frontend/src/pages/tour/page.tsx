import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tours } from "@/mocks/tours";
import { getTourDetails } from "@/mocks/tourDetails";
import Gallery from "./components/Gallery";
import BookingForm from "./components/BookingForm";
import Reviews from "./components/Reviews";
import Faq from "./components/Faq";
import SimilarTours from "./components/SimilarTours";

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation("tour");
  const priceLocale = i18n.language === "es" ? "es-MX" : "en-US";

  const tour = useMemo(() => tours.find((t) => t.slug === slug), [slug]);
  const details = useMemo(() => (tour ? getTourDetails(tour.slug) : null), [tour]);

  if (!tour || !details) {
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

  const allImages = [tour.image, ...details.gallery];

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      {/* Back link */}
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

      {/* Gallery */}
      <div className="w-full px-4 md:px-8 lg:px-12 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto">
          <Gallery images={allImages} title={tour.title} />
        </div>
      </div>

      {/* Title + meta */}
      <div className="w-full px-4 md:px-8 lg:px-12 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-3 mb-2">
            {tour.bestRated && (
              <span className="shrink-0 bg-ocean text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {t("bestRated")}
              </span>
            )}
            <div className="flex flex-wrap gap-1.5">
              {tour.languages.map((lang) => (
                <span
                  key={lang}
                  className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600"
                >
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
              <span className="font-semibold text-charcoal">{tour.rating}</span>
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
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-price-tag-3-line" />
              </div>
              <span>{tour.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full px-4 md:px-8 lg:px-12 pb-10 md:pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left column */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-charcoal mb-4">
                  {t("description.title")}
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed space-y-3 whitespace-pre-line">
                  {details.description}
                </div>
              </div>

              {/* Itinerary */}
              {details.itinerary.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-charcoal mb-4">
                    {t("itinerary.title")}
                  </h3>
                  <div className="space-y-4">
                    {details.itinerary.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-ocean/10 text-ocean text-xs font-bold">
                            {i + 1}
                          </div>
                          {i < details.itinerary.length - 1 && (
                            <div className="w-px flex-1 bg-gray-100 my-1" />
                          )}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-ocean bg-ocean/10 px-2 py-0.5 rounded">
                              {item.time}
                            </span>
                            <h4 className="text-sm font-semibold text-charcoal">{item.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Included / Not included */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <h3 className="text-base font-bold text-charcoal mb-4">{t("info.included")}</h3>
                  <ul className="space-y-2.5">
                    {details.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <div className="w-5 h-5 flex items-center justify-center text-ocean shrink-0 mt-0.5">
                          <i className="ri-check-line" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                  <h3 className="text-base font-bold text-charcoal mb-4">{t("info.notIncluded")}</h3>
                  <ul className="space-y-2.5">
                    {details.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <div className="w-5 h-5 flex items-center justify-center text-gray-300 shrink-0 mt-0.5">
                          <i className="ri-close-line" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Meeting point */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-charcoal mb-3">
                  {t("info.meetingPoint")}
                </h3>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/10 text-ocean shrink-0">
                    <i className="ri-map-pin-line text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">{details.meetingPoint}</p>
                  </div>
                </div>
              </div>

              {/* Cancellation */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-charcoal mb-3">
                  {t("info.cancellation")}
                </h3>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-coral/10 text-coral shrink-0">
                    <i className="ri-refund-line text-lg" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{details.cancellationPolicy}</p>
                </div>
              </div>

              {/* Reviews */}
              <Reviews
                reviews={details.reviews}
                overallRating={tour.rating}
                reviewCount={tour.reviewCount}
              />

              {/* FAQ */}
              {details.faq.length > 0 && <Faq faq={details.faq} />}

              {/* Provider */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-charcoal mb-4">
                  {t("provider.title")}
                </h3>
                <div className="flex items-start gap-4">
                  <img
                    src={details.provider.avatar}
                    alt={details.provider.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-semibold text-charcoal">{details.provider.name}</span>
                      {details.provider.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-ocean bg-ocean/10 px-2 py-0.5 rounded-full">
                          <div className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-checkbox-circle-fill" />
                          </div>
                          {t("provider.verified")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {details.provider.tourCount} {t("provider.moreTours")}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">{details.provider.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - sticky booking */}
            <div className="lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-ocean">
                      ${tour.price.toLocaleString(priceLocale)}
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
                      <span className="font-medium text-charcoal">{tour.languages.join(", ")}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">{t("info.maxGuests")}</span>
                      <span className="font-medium text-charcoal">{details.maxGuests} {t("booking.guests")}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-500">{t("info.category")}</span>
                      <span className="font-medium text-charcoal">{tour.category}</span>
                    </div>
                  </div>
                </div>

                <BookingForm
                  tourId={tour.id}
                  price={tour.price}
                  childPrice={details.childPrice}
                  maxGuests={details.maxGuests}
                  priceLocale={priceLocale}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar tours */}
      <SimilarTours currentSlug={tour.slug} category={tour.category} priceLocale={priceLocale} />
    </div>
  );
}
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { testimonials } from "@/mocks/testimonials";
import { onTourImageError } from "@/lib/imageFallback";

export default function Testimonials() {
  const { t } = useTranslation("home");
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[activeIndex];

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-20 bg-offwhite">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal text-center mb-10 md:mb-14">
          {t("testimonials.title")}
        </h2>

        <div className="relative bg-white rounded-2xl p-6 md:p-10 border border-gray-100">
          <button
            onClick={prev}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-ocean hover:text-ocean transition-colors bg-white z-10"
            aria-label="Previous testimonial"
          >
            <i className="ri-arrow-left-line" />
          </button>

          <div className="flex flex-col items-center text-center px-8 md:px-16">
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 flex items-center justify-center ${
                    i < testimonial.rating ? "text-coral" : "text-gray-200"
                  }`}
                >
                  <i className="ri-star-fill" />
                </div>
              ))}
            </div>

            <p className="text-base md:text-lg text-charcoal/80 leading-relaxed mb-6 max-w-2xl italic">
              "{testimonial.text}"
            </p>

            <div className="flex items-center gap-3">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                onError={onTourImageError}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-charcoal">{testimonial.name}</p>
                <p className="text-xs text-gray-500">
                  {testimonial.location} · {testimonial.tour}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={next}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-ocean hover:text-ocean transition-colors bg-white z-10"
            aria-label="Next testimonial"
          >
            <i className="ri-arrow-right-line" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-ocean" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
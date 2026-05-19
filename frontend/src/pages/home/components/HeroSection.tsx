import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const heroImages = [
  "https://readdy.ai/api/search-image?query=Dramatic%20golden%20hour%20sunset%20view%20of%20El%20Arco%20rock%20arch%20at%20Lands%20End%20in%20Cabo%20San%20Lucas%20Baja%20California%20Sur%20Mexico%20with%20tour%20boats%20in%20turquoise%20water%2C%20warm%20orange%20and%20pink%20sky%2C%20iconic%20coastal%20landmark%2C%20travel%20photography%20with%20vivid%20colors%20and%20high%20contrast&width=1600&height=900&seq=17&orientation=landscape",
  "https://readdy.ai/api/search-image?query=Breathtaking%20panoramic%20view%20of%20Isla%20Espiritu%20Santo%20in%20Baja%20California%20Sur%20Mexico%20with%20pristine%20white%20sand%20beach%2C%20crystal%20clear%20turquoise%20Sea%20of%20Cortez%20water%2C%20dramatic%20volcanic%20rock%20formations%20and%20lush%20vegetation%2C%20aerial%20coastal%20photography%20with%20vibrant%20natural%20colors&width=1600&height=900&seq=18&orientation=landscape",
  "https://readdy.ai/api/search-image?query=Colorful%20sea%20kayaks%20paddling%20on%20mirror-calm%20turquoise%20water%20in%20Baja%20California%20Sur%20Mexico%20at%20sunrise%20with%20golden%20light%20reflecting%20on%20the%20Sea%20of%20Cortez%2C%20distant%20desert%20mountains%20and%20clear%20sky%2C%20outdoor%20adventure%20photography%20with%20warm%20tones&width=1600&height=900&seq=19&orientation=landscape",
];

export default function HeroSection() {
  const { t, i18n } = useTranslation("home");
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [destOpen, setDestOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);

  const destinations = [
    { label: t("destinations.laPaz"), value: "la-paz" },
    { label: t("destinations.losCabos"), value: "los-cabos" },
    { label: t("destinations.caboSanLucas"), value: "cabo-san-lucas" },
  ];

  // Values match the canonical names the /tours page uses to map to the backend enum.
  // Do not change casing or accents without updating tours/page.tsx::categoryByName.
  const categories = [
    { label: t("categories.adventure"), value: "Aventura" },
    { label: t("categories.cultural"), value: "Cultural" },
    { label: t("categories.gastronomic"), value: "Gastronómico" },
    { label: t("categories.transport"), value: "Transporte" },
    { label: t("categories.housing"), value: "Renta de Casas" },
    { label: t("categories.fishing", { defaultValue: "Pesca" }), value: "Pesca" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedDest) params.set("destination", selectedDest);
    if (selectedCat) params.set("category", selectedCat);
    if (date) params.set("date", date);
    if (people) params.set("people", String(people));
    navigate(`/tours?${params.toString()}`);
  }, [selectedDest, selectedCat, date, people, navigate]);

  return (
    <section className="relative w-full h-[520px] md:h-[680px] lg:h-[760px] overflow-hidden">
      {heroImages.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt="Baja California Sur"
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8 lg:px-12 pt-16">
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-4xl leading-tight">
          {t("hero.title")}
        </h1>
        <p className="mt-4 md:mt-6 text-base md:text-xl text-white/90 text-center max-w-2xl">
          {t("hero.subtitle")}
        </p>

        <div className="mt-8 md:mt-12 w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <div className="relative flex-1">
              <button
                onClick={() => { setDestOpen(!destOpen); setCatOpen(false); }}
                className="w-full flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 text-left hover:bg-white/95 transition-colors"
              >
                <div className="w-5 h-5 flex items-center justify-center text-ocean">
                  <i className="ri-map-pin-line" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">{t("hero.searchPlaceholder")}</p>
                  <p className="text-sm font-medium text-charcoal truncate">
                    {selectedDest
                      ? destinations.find((d) => d.value === selectedDest)?.label
                      : t("hero.allDestinations")}
                  </p>
                </div>
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`ri-arrow-down-s-line transition-transform ${destOpen ? "rotate-180" : ""}`} />
                </div>
              </button>
              {destOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => { setSelectedDest(""); setDestOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                  >
                    {t("hero.allDestinations")}
                  </button>
                  {destinations.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => { setSelectedDest(d.value); setDestOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <button
                onClick={() => { setCatOpen(!catOpen); setDestOpen(false); }}
                className="w-full flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 text-left hover:bg-white/95 transition-colors"
              >
                <div className="w-5 h-5 flex items-center justify-center text-ocean">
                  <i className="ri-apps-line" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">{t("hero.categoryLabel")}</p>
                  <p className="text-sm font-medium text-charcoal truncate">
                    {selectedCat
                      ? categories.find((c) => c.value === selectedCat)?.label
                      : t("hero.allCategories")}
                  </p>
                </div>
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`ri-arrow-down-s-line transition-transform ${catOpen ? "rotate-180" : ""}`} />
                </div>
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                  <button
                    onClick={() => { setSelectedCat(""); setCatOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                  >
                    {t("hero.allCategories")}
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => { setSelectedCat(c.value); setCatOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 flex-1">
              <div className="w-5 h-5 flex items-center justify-center text-ocean">
                <i className="ri-calendar-line" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">{t("hero.dateLabel")}</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm font-medium text-charcoal bg-transparent outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 flex-1">
              <div className="w-5 h-5 flex items-center justify-center text-ocean">
                <i className="ri-user-line" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">{t("hero.peopleLabel")}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPeople(Math.max(1, people - 1))}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <i className="ri-subtract-line text-xs" />
                  </button>
                  <span className="text-sm font-medium text-charcoal w-4 text-center">{people}</span>
                  <button
                    onClick={() => setPeople(people + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <i className="ri-add-line text-xs" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="bg-coral hover:bg-coral/90 text-white font-semibold px-6 md:px-8 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-search-line" />
              </div>
              {t("hero.searchButton")}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentImage ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
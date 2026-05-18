import { useTranslation } from "react-i18next";

const steps = [
  {
    icon: "ri-search-line",
    titleKey: "step1",
    descKey: "step1Desc",
    color: "#0B4F6C",
    bgColor: "#E8F4F8",
  },
  {
    icon: "ri-calendar-check-line",
    titleKey: "step2",
    descKey: "step2Desc",
    color: "#FF6B6B",
    bgColor: "#FFF1F1",
  },
  {
    icon: "ri-emotion-happy-line",
    titleKey: "step3",
    descKey: "step3Desc",
    color: "#059669",
    bgColor: "#ECFDF5",
  },
];

export default function HowItWorks() {
  const { t } = useTranslation("home");

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-charcoal text-center mb-10 md:mb-14">
          {t("howItWorks.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <div key={step.titleKey} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: step.bgColor }}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                    <i className={`${step.icon} text-2xl md:text-3xl`} style={{ color: step.color }} />
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 lg:-right-10 w-6 lg:w-8 h-px bg-gray-200" />
                )}
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: step.color }}
                >
                  {index + 1}
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-2">
                {t(`howItWorks.${step.titleKey}`)}
              </h3>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                {t(`howItWorks.${step.descKey}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
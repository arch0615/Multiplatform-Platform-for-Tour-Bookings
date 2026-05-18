import { useState } from "react";
import { useTranslation } from "react-i18next";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  faq: FaqItem[];
}

export default function Faq({ faq }: FaqProps) {
  const { t } = useTranslation("tour");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
      <h3 className="text-lg md:text-xl font-bold text-charcoal mb-5">
        {t("faq.title")}
      </h3>

      <div className="space-y-3">
        {faq.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-offwhite/50 transition-colors"
              >
                <span className="text-sm font-semibold text-charcoal pr-4">{item.question}</span>
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-charcoal shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <i className="ri-arrow-down-s-line" />
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
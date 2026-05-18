import { useState } from "react";
import { useTranslation } from "react-i18next";

interface GalleryProps {
  images: string[];
  title: string;
}

export default function Gallery({ images, title }: GalleryProps) {
  const { t } = useTranslation("tour");
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLbIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => setLbIndex((i) => (i + 1) % images.length);
  const prevImage = () => setLbIndex((i) => (i - 1 + images.length) % images.length);

  if (images.length === 0) return null;

  return (
    <div className="w-full">
      {/* Main image */}
      <div
        className="relative w-full h-[280px] sm:h-[360px] md:h-[440px] rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => openLightbox(selected)}
      >
        <img
          src={images[selected]}
          alt={title}
          className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(0);
            }}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-charcoal text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
          >
            {t("gallery.viewAll")} ({images.length})
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                i === selected ? "border-ocean" : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <i className="ri-close-line text-xl" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 md:left-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <i className="ri-arrow-left-line text-lg" />
          </button>

          <img
            src={images[lbIndex]}
            alt={title}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 md:right-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <i className="ri-arrow-right-line text-lg" />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full">
            {lbIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
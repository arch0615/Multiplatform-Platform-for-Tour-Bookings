import type { SyntheticEvent } from "react";

// Generic beach scene used when a tour/cover image fails to load. Provider-uploaded
// URLs rot over time (Unsplash removes photos, external hosts go down) and we'd
// rather show something pleasant than the broken-image icon + alt text.
export const TOUR_IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop";

// onError handler for tour/cover <img> tags. Swaps src to the placeholder once.
// The dataset flag prevents an infinite loop if the placeholder itself fails.
export function onTourImageError(e: SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "1";
  img.src = TOUR_IMAGE_PLACEHOLDER;
}

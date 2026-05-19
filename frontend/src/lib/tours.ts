import { api } from "./api";

export const TourCategory = {
  Adventure: 0,
  Cultural: 1,
  Gastronomic: 2,
  Transport: 3,
  Housing: 4,
  Fishing: 5,
} as const;
export type TourCategory = typeof TourCategory[keyof typeof TourCategory];

export type TourImage = { url: string; caption: string | null };
export type TourProvider = { id: string; companyName: string; verified: boolean };

export type TourListItem = {
  id: string;
  slug: string;
  title: string;
  category: TourCategory;
  location: string;
  duration: string;
  languages: string;
  priceAdult: number;
  priceChild: number | null;
  maxGuests: number;
  rating: number;
  reviewCount: number;
  coverImageUrl: string | null;
  providerName: string;
};

export type TourDetail = {
  id: string;
  slug: string;
  title: string;
  category: TourCategory;
  location: string;
  description: string;
  itinerary: string | null;
  meetingPoint: string | null;
  duration: string;
  languages: string;
  priceAdult: number;
  priceChild: number | null;
  maxGuests: number;
  rating: number;
  reviewCount: number;
  images: TourImage[];
  provider: TourProvider;
};

export type ListToursParams = {
  category?: TourCategory;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  q?: string;
  minRating?: number;
  sort?: "recommended" | "priceLow" | "priceHigh" | "rating" | "newest";
  page?: number;
  pageSize?: number;
};

export function listTours(params: ListToursParams = {}): Promise<TourListItem[]> {
  const qs = new URLSearchParams();
  if (params.category !== undefined) qs.set("category", String(params.category));
  if (params.location) qs.set("location", params.location);
  if (params.minPrice !== undefined) qs.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) qs.set("maxPrice", String(params.maxPrice));
  if (params.language) qs.set("language", params.language);
  if (params.q) qs.set("q", params.q);
  if (params.minRating !== undefined) qs.set("minRating", String(params.minRating));
  if (params.sort && params.sort !== "recommended") qs.set("sort", params.sort);
  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.pageSize !== undefined) qs.set("pageSize", String(params.pageSize));
  const suffix = qs.toString();
  return api<TourListItem[]>(`/tours${suffix ? `?${suffix}` : ""}`, { auth: false });
}

export function getTourBySlug(slug: string): Promise<TourDetail> {
  return api<TourDetail>(`/tours/${encodeURIComponent(slug)}`, { auth: false });
}

export const ReviewSource = {
  Internal: 0,
  Google: 1,
  TripAdvisor: 2,
} as const;
export type ReviewSource = typeof ReviewSource[keyof typeof ReviewSource];

export type TourReview = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  comment: string;
  source: ReviewSource;
  verified: boolean;
  createdAt: string;
};

export function getTourReviews(slug: string): Promise<TourReview[]> {
  return api<TourReview[]>(`/tours/${encodeURIComponent(slug)}/reviews`, { auth: false });
}

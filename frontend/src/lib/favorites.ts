import { api } from "./api";
import type { TourCategory } from "./tours";

export type Favorite = {
  tourId: string;
  slug: string;
  title: string;
  category: TourCategory;
  location: string;
  duration: string;
  languages: string;
  priceAdult: number;
  priceChild: number | null;
  rating: number;
  reviewCount: number;
  coverImageUrl: string | null;
  providerName: string;
  favoritedAt: string;
};

export function listMyFavorites(): Promise<Favorite[]> {
  return api<Favorite[]>("/favorites/me");
}

export function listMyFavoriteIds(): Promise<string[]> {
  return api<string[]>("/favorites/me/ids");
}

export function addFavorite(tourId: string): Promise<void> {
  return api<void>(`/favorites/${tourId}`, { method: "POST" });
}

export function removeFavorite(tourId: string): Promise<void> {
  return api<void>(`/favorites/${tourId}`, { method: "DELETE" });
}

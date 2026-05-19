import { api } from "./api";
import { TourCategory } from "./tours";

export const TourStatus = {
  Active: 0,
  Paused: 1,
  Archived: 2,
} as const;
export type TourStatus = typeof TourStatus[keyof typeof TourStatus];

export type ProviderTour = {
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
  status: TourStatus;
  createdAt: string;
  updatedAt: string;
  imageUrls: string[];
  bookingCount: number;
};

export type WriteTourInput = {
  title: string;
  category: TourCategory;
  location: string;
  description: string;
  itinerary?: string;
  meetingPoint?: string;
  duration: string;
  languages: string;
  priceAdult: number;
  priceChild?: number;
  maxGuests: number;
  status: TourStatus;
  imageUrls: string[];
};

export function listMyTours(): Promise<ProviderTour[]> {
  return api<ProviderTour[]>("/provider/tours");
}

export function getMyTour(id: string): Promise<ProviderTour> {
  return api<ProviderTour>(`/provider/tours/${id}`);
}

export function createMyTour(input: WriteTourInput): Promise<ProviderTour> {
  return api<ProviderTour>("/provider/tours", { method: "POST", body: input });
}

export function updateMyTour(id: string, input: WriteTourInput): Promise<ProviderTour> {
  return api<ProviderTour>(`/provider/tours/${id}`, { method: "PUT", body: input });
}

export function archiveMyTour(id: string): Promise<ProviderTour> {
  return api<ProviderTour>(`/provider/tours/${id}`, { method: "DELETE" });
}

import { api } from "./api";

export type AvailabilityWindow = {
  id: string;
  date: string;              // "YYYY-MM-DD"
  startTime: string | null;  // "HH:MM:SS"
  capacity: number;
  booked: number;
  remaining: number;
  priceOverride: number | null;
};

export type PublicAvailabilitySlot = {
  date: string;
  startTime: string | null;
  remaining: number;
  priceOverride: number | null;
};

export type WriteAvailabilityItem = {
  date: string;              // "YYYY-MM-DD"
  startTime?: string | null; // "HH:MM" or "HH:MM:SS"
  capacity: number;
  priceOverride?: number | null;
};

// ---------- provider ----------

export function getMyTourAvailability(tourId: string, from?: string, to?: string): Promise<AvailabilityWindow[]> {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  const suffix = qs.toString();
  return api<AvailabilityWindow[]>(`/provider/tours/${tourId}/availability${suffix ? `?${suffix}` : ""}`);
}

export function writeMyTourAvailability(tourId: string, items: WriteAvailabilityItem[]): Promise<AvailabilityWindow[]> {
  return api<AvailabilityWindow[]>(`/provider/tours/${tourId}/availability`, {
    method: "PUT",
    body: { items },
  });
}

// ---------- public ----------

export function getPublicAvailability(slug: string, monthYyyyMm?: string): Promise<PublicAvailabilitySlot[]> {
  const qs = monthYyyyMm ? `?month=${monthYyyyMm}` : "";
  return api<PublicAvailabilitySlot[]>(`/tours/${encodeURIComponent(slug)}/availability${qs}`, { auth: false });
}

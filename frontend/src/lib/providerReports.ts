import { api } from "./api";
import { BookingStatus, PaymentStatus } from "./bookings";

export type ProviderBooking = {
  id: string;
  reference: string;
  status: BookingStatus;
  date: string;
  startTime: string | null;
  adults: number;
  children: number;
  totalPrice: number;
  commissionAmount: number;
  netToProvider: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  tourId: string;
  tourTitle: string;
  tourSlug: string;
  paymentStatus: PaymentStatus | null;
  createdAt: string;
};

export type EarningsMonth = {
  yearMonth: string;
  label: string;
  gross: number;
  commission: number;
  net: number;
  bookings: number;
};

export type TopTour = {
  tourId: string;
  title: string;
  bookings: number;
  net: number;
};

export type ProviderEarnings = {
  totalGross: number;
  totalCommission: number;
  totalNet: number;
  pendingPayout: number;
  confirmedCount: number;
  completedCount: number;
  currency: string;
  monthly: EarningsMonth[];
  topTours: TopTour[];
};

export type ListBookingsFilters = {
  status?: BookingStatus;
  from?: string;
  to?: string;
};

export function listProviderBookings(filters: ListBookingsFilters = {}): Promise<ProviderBooking[]> {
  const qs = new URLSearchParams();
  if (filters.status !== undefined) qs.set("status", String(filters.status));
  if (filters.from) qs.set("from", filters.from);
  if (filters.to) qs.set("to", filters.to);
  const suffix = qs.toString();
  return api<ProviderBooking[]>(`/provider/bookings${suffix ? `?${suffix}` : ""}`);
}

export function getProviderEarnings(): Promise<ProviderEarnings> {
  return api<ProviderEarnings>("/provider/earnings");
}

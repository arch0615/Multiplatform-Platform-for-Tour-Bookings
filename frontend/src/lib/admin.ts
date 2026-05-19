import { api } from "./api";
import { BookingStatus, PaymentStatus } from "./bookings";
import { ProviderStatus } from "@/contexts/AuthContext";

export type AdminProvider = {
  id: string;
  companyName: string;
  ownerFullName: string;
  ownerEmail: string;
  rfc: string | null;
  location: string | null;
  description: string | null;
  commissionRate: number;
  verified: boolean;
  status: ProviderStatus;
  tourCount: number;
  bookingCount: number;
  lifetimeGross: number;
  createdAt: string;
};

export type AdminBooking = {
  id: string;
  reference: string;
  status: BookingStatus;
  date: string;
  startTime: string | null;
  adults: number;
  children: number;
  totalPrice: number;
  commissionAmount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  tourId: string;
  tourTitle: string;
  providerId: string;
  providerName: string;
  paymentStatus: PaymentStatus | null;
  createdAt: string;
};

export type DashboardMonth = {
  yearMonth: string;
  label: string;
  gross: number;
  commission: number;
  bookings: number;
};

export type AdminDashboardStats = {
  totalGrossLifetime: number;
  totalCommissionLifetime: number;
  bookingsLifetime: number;
  activeProviders: number;
  pendingProviders: number;
  activeTours: number;
  totalUsers: number;
  bookings30d: number;
  gross30d: number;
  commission30d: number;
  currency: string;
  monthly: DashboardMonth[];
};

export function getAdminStats(): Promise<AdminDashboardStats> {
  return api<AdminDashboardStats>("/admin/dashboard-stats");
}

export function listAdminProviders(params: { status?: ProviderStatus; q?: string } = {}): Promise<AdminProvider[]> {
  const qs = new URLSearchParams();
  if (params.status !== undefined) qs.set("status", String(params.status));
  if (params.q) qs.set("q", params.q);
  const suffix = qs.toString();
  return api<AdminProvider[]>(`/admin/providers${suffix ? `?${suffix}` : ""}`);
}

export function verifyProvider(id: string): Promise<AdminProvider> {
  return api<AdminProvider>(`/admin/providers/${id}/verify`, { method: "POST" });
}

export function suspendProvider(id: string, reason?: string): Promise<AdminProvider> {
  return api<AdminProvider>(`/admin/providers/${id}/suspend`, { method: "POST", body: { reason } });
}

export function listAdminBookings(params: {
  status?: BookingStatus;
  providerId?: string;
  from?: string;
  to?: string;
} = {}): Promise<AdminBooking[]> {
  const qs = new URLSearchParams();
  if (params.status !== undefined) qs.set("status", String(params.status));
  if (params.providerId) qs.set("providerId", params.providerId);
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  const suffix = qs.toString();
  return api<AdminBooking[]>(`/admin/bookings${suffix ? `?${suffix}` : ""}`);
}

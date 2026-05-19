import { api } from "./api";

export const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  Cancelled: 2,
  Completed: 3,
} as const;
export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export const PaymentStatus = {
  Pending: 0,
  Processing: 1,
  Approved: 2,
  Rejected: 3,
  Refunded: 4,
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export type TourSummary = {
  id: string;
  slug: string;
  title: string;
  location: string;
  duration: string;
  coverImageUrl: string | null;
  providerName: string;
};

export type PaymentSummary = {
  provider: number;
  status: PaymentStatus;
  providerPaymentId: string | null;
};

export type Booking = {
  id: string;
  reference: string;
  status: BookingStatus;
  date: string;
  startTime: string | null;
  adults: number;
  children: number;
  subtotal: number;
  discountAmount: number;
  commissionAmount: number;
  totalPrice: number;
  currency: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  notes: string | null;
  createdAt: string;
  tour: TourSummary;
  payment: PaymentSummary | null;
};

export type CreateBookingInput = {
  tourId: string;
  date: string;
  startTime?: string;
  adults: number;
  children: number;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  notes?: string;
  couponCode?: string;
};

export type CreateBookingResponse = {
  booking: Booking;
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
};

export function createBooking(input: CreateBookingInput): Promise<CreateBookingResponse> {
  return api<CreateBookingResponse>("/bookings", { method: "POST", body: input });
}

export function getBooking(bookingId: string): Promise<Booking> {
  return api<Booking>(`/bookings/${bookingId}`);
}

export function listMyBookings(): Promise<Booking[]> {
  return api<Booking[]>("/bookings/me");
}

export function cancelBooking(bookingId: string, reason: string, comment?: string): Promise<Booking> {
  return api<Booking>(`/bookings/${bookingId}/cancel`, {
    method: "POST",
    body: { reason, comment },
  });
}

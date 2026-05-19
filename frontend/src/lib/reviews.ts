import { api } from "./api";

export const ReviewStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const;
export type ReviewStatus = typeof ReviewStatus[keyof typeof ReviewStatus];

export const ReviewSource = {
  Internal: 0,
  Google: 1,
  TripAdvisor: 2,
} as const;
export type ReviewSource = typeof ReviewSource[keyof typeof ReviewSource];

export type SubmitReviewInput = {
  rating: number;
  title?: string;
  comment: string;
};

export type ImportReviewInput = {
  tourSlug: string;
  authorName: string;
  rating: number;
  title?: string;
  comment: string;
  source: ReviewSource;
  requiresApproval?: boolean;
  createdAt?: string;
};

export type AdminReview = {
  id: string;
  bookingId: string | null;
  userId: string | null;
  tourId: string;
  tourSlug: string;
  tourTitle: string;
  providerName: string;
  authorName: string;
  rating: number;
  title: string | null;
  comment: string;
  source: ReviewSource;
  status: ReviewStatus;
  createdAt: string;
};

export type ProviderReview = {
  id: string;
  tourId: string;
  tourSlug: string;
  tourTitle: string;
  authorName: string;
  rating: number;
  title: string | null;
  comment: string;
  source: ReviewSource;
  status: ReviewStatus;
  createdAt: string;
};

export function submitBookingReview(bookingId: string, input: SubmitReviewInput): Promise<AdminReview> {
  return api<AdminReview>(`/bookings/${bookingId}/review`, { method: "POST", body: input });
}

export function listAdminReviews(status?: ReviewStatus): Promise<AdminReview[]> {
  const qs = status !== undefined ? `?status=${status}` : "";
  return api<AdminReview[]>(`/admin/reviews${qs}`);
}

export function approveReview(id: string): Promise<AdminReview> {
  return api<AdminReview>(`/admin/reviews/${id}/approve`, { method: "POST" });
}

export function rejectReview(id: string): Promise<AdminReview> {
  return api<AdminReview>(`/admin/reviews/${id}/reject`, { method: "POST" });
}

export function importReview(input: ImportReviewInput): Promise<AdminReview> {
  return api<AdminReview>("/admin/reviews/import", { method: "POST", body: input });
}

export function listProviderReviews(): Promise<ProviderReview[]> {
  return api<ProviderReview[]>("/provider/reviews");
}

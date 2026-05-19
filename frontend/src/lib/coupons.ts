import { api } from "./api";

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountPercent: number;
  discountAmount: number | null;
  validFrom: string | null;
  validUntil: string | null;
  maxRedemptions: number | null;
  redeemed: number;
  active: boolean;
  createdAt: string;
};

export type WriteCouponInput = {
  code: string;
  description?: string | null;
  discountPercent: number;
  discountAmount?: number | null;
  validFrom?: string | null;
  validUntil?: string | null;
  maxRedemptions?: number | null;
  active: boolean;
};

export type ValidateCouponResult = {
  valid: boolean;
  reason: string | null;
  code: string;
  description: string | null;
  discountPercent: number;
  discountAmount: number | null;
  appliedDiscount: number;
  newTotal: number;
};

export function validateCoupon(code: string, subtotal: number): Promise<ValidateCouponResult> {
  return api<ValidateCouponResult>("/coupons/validate", { method: "POST", body: { code, subtotal } });
}

// Admin
export function listCoupons(): Promise<Coupon[]> {
  return api<Coupon[]>("/admin/coupons");
}

export function getCoupon(id: string): Promise<Coupon> {
  return api<Coupon>(`/admin/coupons/${id}`);
}

export function createCoupon(input: WriteCouponInput): Promise<Coupon> {
  return api<Coupon>("/admin/coupons", { method: "POST", body: input });
}

export function updateCoupon(id: string, input: WriteCouponInput): Promise<Coupon> {
  return api<Coupon>(`/admin/coupons/${id}`, { method: "PUT", body: input });
}

export function archiveCoupon(id: string): Promise<Coupon> {
  return api<Coupon>(`/admin/coupons/${id}`, { method: "DELETE" });
}

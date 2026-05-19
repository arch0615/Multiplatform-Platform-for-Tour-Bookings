import { api } from "./api";

export function verifyEmail(token: string): Promise<unknown> {
  return api("/auth/verify-email", { method: "POST", auth: false, body: { token } });
}

export function requestPasswordReset(email: string): Promise<unknown> {
  return api("/auth/forgot-password", { method: "POST", auth: false, body: { email } });
}

export function resetPassword(token: string, newPassword: string): Promise<unknown> {
  return api("/auth/reset-password", { method: "POST", auth: false, body: { token, newPassword } });
}

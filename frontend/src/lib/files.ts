import { ApiError } from "./api";
import { authStorage } from "./auth-storage";

const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "")
  ?? "http://localhost:5080/api";

// Strip the trailing "/api" so we can resolve uploaded files against the API
// host (the static-files middleware serves them at /uploads/...).
const apiOrigin = apiBase.replace(/\/api$/, "");

export type UploadedImage = {
  url: string;        // absolute URL, ready to use in <img src>
  size: number;
  contentType: string;
};

export async function uploadImage(file: File): Promise<UploadedImage> {
  const form = new FormData();
  form.append("file", file);

  const tokens = authStorage.get();
  const headers: Record<string, string> = {};
  if (tokens?.accessToken) headers["Authorization"] = `Bearer ${tokens.accessToken}`;
  // Important: do NOT set Content-Type — the browser must add the multipart boundary.

  const res = await fetch(`${apiBase}/files/upload`, {
    method: "POST",
    headers,
    body: form,
  });

  const text = await res.text();
  let parsed: unknown = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }

  if (!res.ok) {
    const msg = typeof parsed === "object" && parsed && "error" in parsed
      ? String((parsed as { error: unknown }).error)
      : `Upload failed (HTTP ${res.status})`;
    throw new ApiError(res.status, msg, parsed);
  }

  const out = parsed as { url: string; size: number; contentType: string };
  return {
    url: out.url.startsWith("http") ? out.url : `${apiOrigin}${out.url}`,
    size: out.size,
    contentType: out.contentType,
  };
}

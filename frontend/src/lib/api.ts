import i18n from "@/i18n";
import { authStorage, type AuthTokens } from "./auth-storage";

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "")
  ?? "http://localhost:5080/api";

// Map the UI language to a full BCP 47 tag so the backend's RequestLocalization
// middleware (configured for es-MX / en-US) can match it.
function acceptLanguage(): string {
  const lang = i18n.language ?? "es";
  if (lang.startsWith("en")) return "en-US,en;q=0.9";
  return "es-MX,es;q=0.9";
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type ApiOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
};

let refreshing: Promise<AuthTokens | null> | null = null;
let onTokensChange: ((tokens: AuthTokens | null) => void) | null = null;

export function setTokenListener(fn: ((tokens: AuthTokens | null) => void) | null) {
  onTokensChange = fn;
}

async function refreshTokens(): Promise<AuthTokens | null> {
  if (refreshing) return refreshing;
  const current = authStorage.get();
  if (!current) return null;

  refreshing = (async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept-Language": acceptLanguage() },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      });
      if (!res.ok) {
        authStorage.clear();
        onTokensChange?.(null);
        return null;
      }
      const data = await res.json();
      const tokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt,
      };
      authStorage.set(tokens);
      onTokensChange?.(tokens);
      return tokens;
    } catch {
      authStorage.clear();
      onTokensChange?.(null);
      return null;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, signal } = options;

  const send = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept-Language": acceptLanguage(),
    };
    if (auth && token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  };

  const tokens = auth ? authStorage.get() : null;
  let res = await send(tokens?.accessToken ?? null);

  if (res.status === 401 && auth && tokens?.refreshToken) {
    const fresh = await refreshTokens();
    if (fresh) {
      res = await send(fresh.accessToken);
    }
  }

  if (!res.ok) {
    const errBody = await parseBody(res);
    const msg = typeof errBody === "object" && errBody && "error" in errBody
      ? String((errBody as { error: unknown }).error)
      : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, msg, errBody);
  }

  return (await parseBody(res)) as T;
}

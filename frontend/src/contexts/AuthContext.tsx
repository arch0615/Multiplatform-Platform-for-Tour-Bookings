import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setTokenListener, ApiError } from "@/lib/api";
import { authStorage, type AuthTokens } from "@/lib/auth-storage";

export const UserRole = {
  Client: 0,
  Provider: 1,
  Admin: 2,
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ProviderStatus = {
  PendingVerification: 0,
  Active: 1,
  Suspended: 2,
} as const;
export type ProviderStatus = typeof ProviderStatus[keyof typeof ProviderStatus];

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  preferredLanguage: string;
  emailVerified: boolean;
  providerId: string | null;
  providerStatus: ProviderStatus | null;
};

type AuthResponse = AuthTokens & { user: AuthUser };

export type RegisterClientInput = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  preferredLanguage?: string;
};

export type RegisterProviderInput = RegisterClientInput & {
  companyName: string;
  rfc?: string;
  location?: string;
  contactPhone?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  registerClient: (input: RegisterClientInput) => Promise<AuthUser>;
  registerProvider: (input: RegisterProviderInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function persistFromResponse(res: AuthResponse) {
  authStorage.set({
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    accessTokenExpiresAt: res.accessTokenExpiresAt,
    refreshTokenExpiresAt: res.refreshTokenExpiresAt,
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTokenListener((t) => {
      if (!t) setUser(null);
    });
    return () => setTokenListener(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const tokens = authStorage.get();
      if (!tokens) {
        setLoading(false);
        return;
      }
      try {
        const me = await api<AuthUser>("/auth/me");
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) {
          authStorage.clear();
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api<AuthResponse>("/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
    persistFromResponse(res);
    setUser(res.user);
    return res.user;
  };

  const registerClient = async (input: RegisterClientInput) => {
    const res = await api<AuthResponse>("/auth/register", {
      method: "POST",
      auth: false,
      body: input,
    });
    persistFromResponse(res);
    setUser(res.user);
    return res.user;
  };

  const registerProvider = async (input: RegisterProviderInput) => {
    const res = await api<AuthResponse>("/auth/register/provider", {
      method: "POST",
      auth: false,
      body: input,
    });
    persistFromResponse(res);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    const tokens = authStorage.get();
    if (tokens?.refreshToken) {
      try {
        await api("/auth/logout", {
          method: "POST",
          body: { refreshToken: tokens.refreshToken },
        });
      } catch (err) {
        if (!(err instanceof ApiError)) throw err;
      }
    }
    authStorage.clear();
    setUser(null);
  };

  const refreshMe = async () => {
    try {
      const me = await api<AuthUser>("/auth/me");
      setUser(me);
      return me;
    } catch {
      setUser(null);
      authStorage.clear();
      return null;
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: user !== null,
    login,
    registerClient,
    registerProvider,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function homeForRole(user: AuthUser): string {
  switch (user.role) {
    case UserRole.Admin:
      return "/admin";
    case UserRole.Provider:
      return "/proveedor";
    default:
      return "/perfil";
  }
}

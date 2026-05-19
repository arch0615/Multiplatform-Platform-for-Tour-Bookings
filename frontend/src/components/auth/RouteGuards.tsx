import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { homeForRole, useAuth, type UserRole } from "@/contexts/AuthContext";

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite">
      <div className="w-10 h-10 rounded-full border-2 border-ocean border-t-transparent animate-spin" />
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageSpinner />;
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }
  return <>{children}</>;
}

export function RequireRole({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageSpinner />;
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }
  if (!roles.includes(user.role)) {
    return <Navigate to={homeForRole(user)} replace />;
  }
  return <>{children}</>;
}

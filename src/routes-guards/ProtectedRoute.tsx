import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

/** Renders children only when a token + user are present. Redirects to /login otherwise. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
  }, [isAuthenticated, navigate]);
  if (!isAuthenticated) return null;
  return <>{children}</>;
}

export function UserRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    else if (user?.role !== "USER") navigate({ to: "/403" });
  }, [isAuthenticated, user, navigate]);
  if (!isAuthenticated || user?.role !== "USER") return null;
  return <>{children}</>;
}

export function ProviderRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) navigate({ to: "/login" });
    else if (user?.role !== "PROVIDER") navigate({ to: "/403" });
  }, [isAuthenticated, user, navigate]);
  if (!isAuthenticated || user?.role !== "PROVIDER") return null;
  return <>{children}</>;
}

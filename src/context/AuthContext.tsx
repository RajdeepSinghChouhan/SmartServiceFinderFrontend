import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { storage } from "../utils/localStorage";
import { decodeToken, isTokenExpired } from "../utils/jwt";

export type Role = "USER" | "PROVIDER";

export type AuthUser = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
};

type AuthCtx = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, role?: Role) => AuthUser;
  loginWithToken: (token: string) => AuthUser | null;
  logout: () => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
  hasRole: (role: Role) => boolean;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = STORAGE_KEYS.legacyUser;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setUser(JSON.parse(raw));
      const t = storage.get(STORAGE_KEYS.token);
      if (t && !isTokenExpired(t)) setToken(t);
      else if (t) storage.clearAuth();
    } catch {}
  }, []);

  const persist = (u: AuthUser | null, t?: string | null) => {
    setUser(u);
    if (t !== undefined) setToken(t);
    if (typeof window === "undefined") return;
    if (u) {
      window.localStorage.setItem(KEY, JSON.stringify(u));
      storage.set(STORAGE_KEYS.userId, String(u.id));
      storage.set(STORAGE_KEYS.username, u.username);
      storage.set(STORAGE_KEYS.role, u.role);
      if (t) storage.set(STORAGE_KEYS.token, t);
    } else {
      storage.clearAuth();
    }
  };

  // Mock-mode login: keep working when the Spring Boot backend isn't running.
  // Mints a synthetic non-JWT token so axios interceptors still attach headers.
  const login = (username: string, role: Role = "USER") => {
    const u: AuthUser = {
      id: 1001,
      username: username || "demo_user",
      fullName: "Demo User",
      email: `${username || "demo"}@ssf.app`,
      phone: "+91 98765 43210",
      address: "123, MG Road, Bengaluru, KA 560001",
      role,
    };
    const mockToken = `mock.${btoa(JSON.stringify({ userId: u.id, username: u.username, role }))}.sig`;
    persist(u, mockToken);
    return u;
  };

  // Real backend path — decode the JWT returned by POST /auth/login.
  const loginWithToken = (jwt: string): AuthUser | null => {
    const payload = decodeToken(jwt);
    if (!payload || isTokenExpired(jwt)) return null;
    const role = (payload.role as Role) || "USER";
    const u: AuthUser = {
      id: Number(payload.userId ?? payload.sub ?? 0) || 0,
      username: String(payload.username ?? payload.sub ?? "user"),
      fullName: String(payload.username ?? "User"),
      email: "",
      phone: "",
      address: "",
      role,
    };
    persist(u, jwt);
    return u;
  };

  const logout = () => persist(null, null);
  const updateProfile = (patch: Partial<AuthUser>) => {
    if (!user) return;
    persist({ ...user, ...patch }, token);
  };

  const hasRole = (role: Role) => user?.role === role;

  return (
    <Ctx.Provider value={{ user, token, isAuthenticated: !!user, login, loginWithToken, logout, updateProfile, hasRole }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
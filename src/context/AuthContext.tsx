import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
  isAuthenticated: boolean;
  login: (username: string, role?: Role) => AuthUser;
  logout: () => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "ssf_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (typeof window === "undefined") return;
    if (u) window.localStorage.setItem(KEY, JSON.stringify(u));
    else window.localStorage.removeItem(KEY);
  };

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
    persist(u);
    return u;
  };

  const logout = () => persist(null);
  const updateProfile = (patch: Partial<AuthUser>) => {
    if (!user) return;
    persist({ ...user, ...patch });
  };

  return (
    <Ctx.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
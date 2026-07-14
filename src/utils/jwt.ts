import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  userId?: number | string;
  sub?: string;
  username?: string;
  role?: "USER" | "PROVIDER";
  exp?: number;
  iat?: number;
};

export function decodeToken(token: string): JwtPayload | null {
  try { return jwtDecode<JwtPayload>(token); } catch { return null; }
}

export function isTokenExpired(token: string): boolean {
  const p = decodeToken(token);
  if (!p?.exp) return false;
  return p.exp * 1000 < Date.now();
}

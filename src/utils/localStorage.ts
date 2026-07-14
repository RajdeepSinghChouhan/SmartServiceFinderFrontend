// Thin, SSR-safe wrappers around window.localStorage so the API layer never
// throws during server rendering.
import { STORAGE_KEYS } from "./constants";

const hasWindow = () => typeof window !== "undefined";

export const storage = {
  get(key: string): string | null {
    if (!hasWindow()) return null;
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  set(key: string, value: string) {
    if (!hasWindow()) return;
    try { window.localStorage.setItem(key, value); } catch {}
  },
  remove(key: string) {
    if (!hasWindow()) return;
    try { window.localStorage.removeItem(key); } catch {}
  },
  clearAuth() {
    [
      STORAGE_KEYS.token,
      STORAGE_KEYS.userId,
      STORAGE_KEYS.username,
      STORAGE_KEYS.role,
      STORAGE_KEYS.legacyUser,
    ].forEach((k) => this.remove(k));
  },
};

export function getToken() { return storage.get(STORAGE_KEYS.token); }
export function getUserId() { return storage.get(STORAGE_KEYS.userId); }
export function getUsername() { return storage.get(STORAGE_KEYS.username); }
export function getRole() { return storage.get(STORAGE_KEYS.role); }

import api from "./axios";
import { API_PATHS, STORAGE_KEYS } from "../utils/constants";

export const userApi = {
  create: (data: any) =>
    api.post(API_PATHS.user.create, data).then((r) => r.data),

  list: () =>
    api.get(API_PATHS.user.list).then((r) => r.data),

  me: async (userId: number | string) => {
    try {
      const res = await api.get(
        API_PATHS.user.me(userId)
      );

      return res.data;
    } catch {
      console.warn(
        "Backend unavailable, using demo profile"
      );

      const raw = localStorage.getItem(
        STORAGE_KEYS.legacyUser
      );

      return raw ? JSON.parse(raw) : null;
    }
  },

  update: async (data: any) => {
    try {
      const res = await api.put(
        API_PATHS.user.update,
        data
      );

      return res.data;
    } catch {
      console.warn(
        "Backend unavailable, updating local profile"
      );

      const raw = localStorage.getItem(
        STORAGE_KEYS.legacyUser
      );

      const current = raw ? JSON.parse(raw) : {};

      const updated = {
        ...current,
        ...data,
      };

      localStorage.setItem(
        STORAGE_KEYS.legacyUser,
        JSON.stringify(updated)
      );

      return updated;
    }
  },
};
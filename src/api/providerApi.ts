import api from "./axios";
import { API_PATHS } from "../utils/constants";
import { providers as mockProviders } from "../data/mock";
import { STORAGE_KEYS } from "../utils/constants";


export const providerApi = {
  create: (data: any) => api.post(API_PATHS.provider.create, data).then((r) => r.data),
  me: async (userId: number | string) => {
    try {
      const res = await api.get(
        API_PATHS.user.me(userId)
      );

      return res.data;
    } catch {
       return {
        id: 1001,
        username: "demo_user",
        fullName: "Demo User",
        email: "demo@ssf.app",
        phone: "+91 9876543210",
        address: "Bengaluru",
      };
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
      return data;
    }
  },
  
  remove: () => api.delete(API_PATHS.provider.delete).then((r) => r.data),
  
  getId: async () => {
    try {
      const res = await api.get<number>(
        API_PATHS.provider.getId
      );

      return res.data;
    } catch {
      console.warn(
        "Backend unavailable, using demo provider id"
      );

      const storedId = localStorage.getItem(
        STORAGE_KEYS.userId
      );

      return storedId ? Number(storedId) : 1;
    }
  },

  all: async () => {
    try {
      const res = await api.get(API_PATHS.provider.all);
      return res.data;
    } catch {
      return mockProviders;
    }
  },

  byId: async (id: number | string) => {
    try {
      const res = await api.get(
        API_PATHS.provider.byId(id)
      );

      return res.data;
    } catch {
      console.warn(
        "Backend unavailable, using mock provider"
      );

      return mockProviders.find(
        (p) => p.id === Number(id)
      );
    }
  },
};

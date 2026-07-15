import api from "./axios";
import { API_PATHS } from "../utils/constants";
import { services as mockServices } from "../data/mock";

export const serviceApi = {
  create: (data: any) => api.post(API_PATHS.service.create, data).then((r) => r.data),
  list: async () => {
    try {
      const res = await api.get(
        API_PATHS.service.list
      );

      return res.data;
    } catch {
      console.warn(
        "Backend unavailable, using mock services"
      );

      return mockServices;
    }
  },

  mine: async () => {
    try {
      const res = await api.get(
        API_PATHS.service.mine
      );

      return res.data;
    } catch {
      return mockServices;
    }
  },

  byId: async (id: number | string) => {
    try {
      const res = await api.get(
        API_PATHS.service.byId(id)
      );

      return res.data;
    } catch (error) {
      console.warn(
        "Backend unavailable, using mock service"
      );

      return mockServices.find(
        (s) => s.id === Number(id)
      );
    }
  },

  remove: (id: number | string) => api.delete(API_PATHS.service.delete(id)).then((r) => r.data),

  byProvider: async (
    providerId: number | string
  ) => {
    try {
      const res = await api.get(
        API_PATHS.service.byProvider(providerId)
      );

      return res.data;
    } catch {
      console.warn(
        "Backend unavailable, using mock services"
      );

      return mockServices.filter(
        (s) =>
          s.providerId === Number(providerId)
      );
    }
  },
};

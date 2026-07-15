import api from "./axios";
import { API_PATHS } from "../utils/constants";
import { providerBookings } from "../data/providerMock";

export const bookingApi = {
  create: (data: any) =>
    api.post(API_PATHS.booking.create, data).then((r) => r.data),

  all: async () => {
    try {
      const res = await api.get(API_PATHS.booking.all);
      return res.data;
    } catch {
      return providerBookings;
    }
  },

  user: async () => {
    try {
      const res = await api.get(API_PATHS.booking.user);
      return res.data;
    } catch {
      return providerBookings;
    }
  },

  provider: async () => {
    try {
      const res = await api.get(API_PATHS.booking.provider);
      return res.data;
    } catch {
      return providerBookings;
    }
  },

  accept: async (id: number | string) => {
    try {
      const res = await api.put(
        API_PATHS.booking.accept(id)
      );
      return res.data;
    } catch {
      return {
        success: true,
        id,
        status: "ACCEPTED",
      };
    }
  },

  reject: async (id: number | string) => {
    try {
      const res = await api.put(
        API_PATHS.booking.reject(id)
      );
      return res.data;
    } catch {
      return {
        success: true,
        id,
        status: "REJECTED",
      };
    }
  },

  cancel: async (id: number | string) => {
    try {
      const res = await api.put(
        API_PATHS.booking.cancel(id)
      );
      return res.data;
    } catch {
      return {
        success: true,
        id,
        status: "CANCELLED",
      };
    }
  },

  complete: async (id: number | string) => {
    try {
      const res = await api.put(
        API_PATHS.booking.completed(id)
      );
      return res.data;
    } catch {
      return {
        success: true,
        id,
        status: "COMPLETED",
      };
    }
  },
};

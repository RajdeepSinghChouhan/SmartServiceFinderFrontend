import api from "./axios";
import { API_PATHS } from "../utils/constants";
import { mockNotifications } from "../data/userMock";

export const notificationApi = {
  list: async (userId: number | string) => {
    try {
      const res = await api.get(
        API_PATHS.notification.list(userId)
      );

      return res.data;
    } catch {
      console.warn(
        "Backend unavailable, using mock notifications"
      );

      return mockNotifications.filter(
        (n) => n.userId === Number(userId)
      );
    }
  },

  unreadCount: async (userId: number | string) => {
    try {
      const res = await api.get<number>(
        API_PATHS.notification.unread(userId)
      );

      return res.data;
    } catch {
      return mockNotifications.filter(
        (n) =>
          n.userId === Number(userId) &&
          !n.isRead
      ).length;
    }
  },

  markRead: async (id: number | string) => {
    try {
      const res = await api.put(
        API_PATHS.notification.read(id)
      );

      return res.data;
    } catch {
      return {
        success: true,
      };
    }
  },

  remove: async (id: number | string) => {
    try {
      const res = await api.delete(
        API_PATHS.notification.delete(id)
      );

      return res.data;
    } catch {
      return {
        success: true,
      };
    }
  },

  retryFailed: async () => {
    try {
      const res = await api.post(
        API_PATHS.notification.retry
      );

      return res.data;
    } catch {
      return {
        success: true,
      };
    }
  },
};
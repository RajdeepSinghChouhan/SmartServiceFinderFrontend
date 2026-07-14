import api from "./axios";
import { API_PATHS } from "../utils/constants";

export const notificationApi = {
  list: (userId: number | string) => api.get(API_PATHS.notification.list(userId)).then((r) => r.data),
  unreadCount: (userId: number | string) =>
    api.get<number>(API_PATHS.notification.unread(userId)).then((r) => r.data),
  markRead: (id: number | string) => api.put(API_PATHS.notification.read(id)).then((r) => r.data),
  remove: (id: number | string) => api.delete(API_PATHS.notification.delete(id)).then((r) => r.data),
  retryFailed: () => api.post(API_PATHS.notification.retry).then((r) => r.data),
};

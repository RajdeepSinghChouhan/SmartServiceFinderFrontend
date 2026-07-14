import api from "./axios";
import { API_PATHS } from "../utils/constants";

export const bookingApi = {
  create: (data: any) => api.post(API_PATHS.booking.create, data).then((r) => r.data),
  all: () => api.get(API_PATHS.booking.all).then((r) => r.data),
  user: () => api.get(API_PATHS.booking.user).then((r) => r.data),
  provider: () => api.get(API_PATHS.booking.provider).then((r) => r.data),
  accept: (id: number | string) => api.put(API_PATHS.booking.accept(id)).then((r) => r.data),
  reject: (id: number | string) => api.put(API_PATHS.booking.reject(id)).then((r) => r.data),
  cancel: (id: number | string) => api.put(API_PATHS.booking.cancel(id)).then((r) => r.data),
  complete: (id: number | string) => api.put(API_PATHS.booking.completed(id)).then((r) => r.data),
};

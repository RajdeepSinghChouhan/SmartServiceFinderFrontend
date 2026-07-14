import api from "./axios";
import { API_PATHS } from "../utils/constants";

export const serviceApi = {
  create: (data: any) => api.post(API_PATHS.service.create, data).then((r) => r.data),
  list: () => api.get(API_PATHS.service.list).then((r) => r.data),
  mine: () => api.get(API_PATHS.service.mine).then((r) => r.data),
  update: (id: number | string, data: any) => api.put(API_PATHS.service.update(id), data).then((r) => r.data),
  byId: (id: number | string) => api.get(API_PATHS.service.byId(id)).then((r) => r.data),
  remove: (id: number | string) => api.delete(API_PATHS.service.delete(id)).then((r) => r.data),
  byProvider: (providerId: number | string) => api.get(API_PATHS.service.byProvider(providerId)).then((r) => r.data),
};

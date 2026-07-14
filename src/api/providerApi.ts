import api from "./axios";
import { API_PATHS } from "../utils/constants";

export const providerApi = {
  create: (data: any) => api.post(API_PATHS.provider.create, data).then((r) => r.data),
  me: () => api.get(API_PATHS.provider.me).then((r) => r.data),
  update: (data: any) => api.put(API_PATHS.provider.update, data).then((r) => r.data),
  remove: () => api.delete(API_PATHS.provider.delete).then((r) => r.data),
  getId: () => api.get<number>(API_PATHS.provider.getId).then((r) => r.data),
  all: () => api.get(API_PATHS.provider.all).then(r => r.data),
  byId: (id: number | string) => api.get(API_PATHS.provider.byId(id)).then((r) => r.data),
};

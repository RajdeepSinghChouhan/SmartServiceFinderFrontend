import api from "./axios";
import { API_PATHS } from "../utils/constants";

export const reviewApi = {
  create: (data: any) => api.post(API_PATHS.review.create, data).then((r) => r.data),
  byProvider: (id: number | string) => api.get(API_PATHS.review.byProvider(id)).then((r) => r.data),
  mine: () => api.get(API_PATHS.review.mine).then((r) => r.data),
  byService: (id: number | string) => api.get(API_PATHS.review.byService(id)).then((r) => r.data),
  update: (id: number | string, data: any) => api.put(API_PATHS.review.update(id), data).then((r) => r.data),
  remove: (id: number | string) => api.delete(API_PATHS.review.delete(id)).then((r) => r.data),
  averageRating: (id: number | string) => api.get<number>(API_PATHS.review.avg(id)).then((r) => r.data),
  count: (id: number | string) => api.get<number>(API_PATHS.review.count(id)).then((r) => r.data),
};

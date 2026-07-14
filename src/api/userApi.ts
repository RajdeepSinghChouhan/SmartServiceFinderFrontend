import api from "./axios";
import { API_PATHS } from "../utils/constants";

export const userApi = {
  create: (data: any) => api.post(API_PATHS.user.create, data).then((r) => r.data),
  list: () => api.get(API_PATHS.user.list).then((r) => r.data),
  me: (userId: number | string) => api.get(API_PATHS.user.me(userId)).then((r) => r.data),
  update: (data: any) => {
  console.log("Inside userApi.update()");
  return api.put(API_PATHS.user.update, data).then((r) => r.data);
},
};

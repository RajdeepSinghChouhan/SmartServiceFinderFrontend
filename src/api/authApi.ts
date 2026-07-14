import api from "./axios";
import { API_PATHS } from "../utils/constants";

export type LoginPayload = { username: string; password: string };
export type RegisterPayload = {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  role: "USER" | "PROVIDER";
};

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<{ token: string }>(API_PATHS.auth.login, payload).then((r) => r.data),
  register: (payload: RegisterPayload) =>
    api.post(API_PATHS.auth.register, payload).then((r) => r.data),
};
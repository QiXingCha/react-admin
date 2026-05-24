import { api } from "@/utils/api";
import type { UserInfo } from "@/types";

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/login", params);
  if (!response.success) {
    throw new Error(response.error ?? "登录失败");
  }
  return response.data!;
}

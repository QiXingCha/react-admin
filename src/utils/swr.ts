import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

export interface SWRConfig {
  /** SWR 配置项 */
  swr?: {
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    dedupingInterval?: number;
    errorRetryCount?: number;
    refreshInterval?: number;
  };
  /** axios 配置项 */
  axios?: AxiosRequestConfig;
}

type Method = "get" | "post" | "put" | "delete";

export async function fetcher<TData>(
  url: string,
  options?: SWRConfig,
): Promise<TData> {
  const method = (options?.axios?.method?.toLowerCase() ?? "get") as Method;

  const response = await api[method]<TData>(url, options?.axios?.data);
  console.log("response", response);
  if (!response.success) {
    throw new Error(response.error ?? "请求失败");
  }

  return response.data!;
}

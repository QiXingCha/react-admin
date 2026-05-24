import axios, { AxiosError } from "axios";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
}

const baseURL = import.meta.env.DEV ? "" : "";

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

function startLoading() {
  document.dispatchEvent(new CustomEvent("api:request-start"));
}

function stopLoading() {
  document.dispatchEvent(new CustomEvent("api:request-end"));
}

// 请求拦截器 1：注入 token
instance.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("app:auth");
    if (stored) {
      try {
        const { token } = JSON.parse(stored);
        config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // ignore
      }
    }

    if (import.meta.env.DEV) {
      console.debug(`[API] → ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("[API] 请求配置错误", error);
    return Promise.reject(error);
  },
);

// 请求拦截器 2：开始加载状态
instance.interceptors.request.use(
  (config) => {
    startLoading();
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器 1：记录日志
instance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.debug(
        `[API] ← ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data,
      );
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.debug(
        `[API] ← ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.message,
      );
    }
    return Promise.reject(error);
  },
);

// 响应拦截器 2：统一错误处理
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    stopLoading();

    const status = error.response?.status;
    let message = error.message;

    switch (status) {
      case 401:
        message = "登录已过期，请重新登录";
        localStorage.removeItem("app:auth");
        window.dispatchEvent(new CustomEvent("auth:expired"));
        break;
      case 403:
        message = "没有权限访问该资源";
        break;
      case 404:
        message = "请求的资源不存在";
        break;
      case 500:
        message = "服务器内部错误";
        break;
      case 502:
      case 503:
        message = "服务暂时不可用";
        break;
      default:
        if (error.response?.data?.error) {
          message = error.response.data.error;
        }
    }

    const err = new Error(message) as Error & { status?: number };
    if (status !== undefined) {
      err.status = status;
    }
    return Promise.reject(err);
  },
);

// 响应拦截器 3：停止加载状态
instance.interceptors.response.use(
  (response) => {
    stopLoading();
    return response;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  },
);

export const api = {
  get<T>(url: string) {
    return instance.get<ApiResponse<T>>(url).then((res) => res.data);
  },

  post<T>(url: string, data?: unknown) {
    return instance.post<ApiResponse<T>>(url, data).then((res) => res.data);
  },

  put<T>(url: string, data?: unknown) {
    return instance.put<ApiResponse<T>>(url, data).then((res) => res.data);
  },

  delete<T>(url: string) {
    return instance.delete<ApiResponse<T>>(url).then((res) => res.data);
  },
};

export { instance as axios };

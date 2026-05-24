import { useShallow } from "zustand/react/shallow";
import { constantRoutes } from "@/routes/routes";
import { useAuthStore } from "@/stores/authStore";
import type { RouteConfig, UserInfo } from "../types";

export interface AuthContextValue {
  /** 是否已登录 */
  isLoggedIn: boolean;
  /** 是否完成首次初始化（用于避免刷新瞬间的闪屏） */
  initialized: boolean;
  user: UserInfo | null;
  token: string | null;
  /** 静态路由（始终可访问） */
  constantRoutes: RouteConfig[];
  /** 当前用户实际可访问的动态路由（已根据 roles 过滤） */
  accessibleRoutes: RouteConfig[];
  /** 拼装后的完整路由表（constantRoutes + AppLayout(accessibleRoutes)） */
  routes: RouteConfig[];
  login: (payload: { token: string; user: UserInfo }) => void;
  logout: () => Promise<void>;
  /** 是否拥有指定角色（任意一个即可） */
  hasRole: (roles: string[] | string) => boolean;
}

function useAuth(): AuthContextValue {
  return useAuthStore(
    useShallow((s) => ({
      isLoggedIn: !!s.user && !!s.token,
      initialized: s.initialized,
      user: s.user,
      token: s.token,
      constantRoutes,
      accessibleRoutes: s.accessibleRoutes,
      routes: s.routes,
      login: s.login,
      logout: s.logout,
      hasRole: s.hasRole,
    })),
  );
}

export default useAuth;

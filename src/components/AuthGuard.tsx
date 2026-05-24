import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "@/hooks/useAuth";

interface AuthGuardProps {
  /** 是否要求已登录，默认 true */
  requiresAuth?: boolean;
  /** 访问该节点所需角色（任一即可） */
  roles?: string[];
  children: ReactNode;
}

/**
 * 路由守卫：
 * - 未登录访问受保护路由 → 跳到 /login
 * - 已登录访问 /login → 跳到 /dashboard
 * - 已登录但角色不足 → 跳到 /403
 */
export function AuthGuard({
  requiresAuth = true,
  roles,
  children,
}: AuthGuardProps) {
  const { isLoggedIn, hasRole, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) return null;

  if (!requiresAuth) {
    if (isLoggedIn && location.pathname === "/login") {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (roles && roles.length > 0 && !hasRole(roles)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}

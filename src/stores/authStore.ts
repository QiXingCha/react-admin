import { create } from "zustand";
import type { UserInfo, RouteConfig } from "@/types";
import { asyncRoutes, constantRoutes } from "@/routes/routes";
import { filterRoutesByRoles } from "@/routes/permission";
import { useTabsStore } from "@/stores/tabsStore";

const STORAGE_KEY = "app:auth";

interface StoredAuth {
  token: string;
  user: UserInfo;
}

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    if (!parsed?.token || !parsed.user) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredAuth(value: StoredAuth | null) {
  if (value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function sessionFromStorage(): {
  user: UserInfo | null;
  token: string | null;
} {
  const stored = readStoredAuth();
  if (!stored) return { user: null, token: null };
  return { user: stored.user, token: stored.token };
}

function computeRoutes(user: UserInfo | null): {
  accessibleRoutes: RouteConfig[];
  routes: RouteConfig[];
} {
  const accessibleRoutes = user
    ? filterRoutesByRoles(asyncRoutes, user.roles)
    : [];
  const routes = constantRoutes.map((route) => {
    if (route.name === "AppLayout") {
      return {
        ...route,
        children: [...(route.children ?? []), ...accessibleRoutes],
      };
    }
    return route;
  });
  return { accessibleRoutes, routes };
}

export type AuthStore = {
  initialized: boolean;
  user: UserInfo | null;
  token: string | null;
  accessibleRoutes: RouteConfig[];
  routes: RouteConfig[];
  login: (payload: { token: string; user: UserInfo }) => void;
  logout: () => Promise<void>;
  hasRole: (roles: string[] | string) => boolean;
};

export const useAuthStore = create<AuthStore>((set, get) => {
  const initial = sessionFromStorage();
  const { accessibleRoutes, routes } = computeRoutes(initial.user);

  return {
    initialized: true,
    user: initial.user,
    token: initial.token,
    accessibleRoutes,
    routes,
    login: ({ token, user }) => {
      writeStoredAuth({ token, user });
      const next = computeRoutes(user);
      set({
        token,
        user,
        accessibleRoutes: next.accessibleRoutes,
        routes: next.routes,
      });
    },
    logout: async () => {
      writeStoredAuth(null);
      useTabsStore.getState().resetTabs();
      const next = computeRoutes(null);
      set({
        user: null,
        token: null,
        accessibleRoutes: next.accessibleRoutes,
        routes: next.routes,
      });
    },
    hasRole: (roles) => {
      const user = get().user;
      if (!user) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      if (list.length === 0) return true;
      return list.some((r) => user.roles.includes(r));
    },
  };
});

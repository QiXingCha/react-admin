import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTabs } from "@/hooks/useTabs";
import type { RouteConfig } from "../types";

export function useKeepAliveTabs(routes: RouteConfig[]) {
  const location = useLocation();
  const navigate = useNavigate();
  const { tabs, activeTabKey, cachedKeys, addTab, setActiveTab } = useTabs();

  useEffect(() => {
    const path = location.pathname;
    const matchedRoute = findRoute(routes, path);

    if (matchedRoute) {
      // 使用 location.pathname 作为缓存 key
      const tabKey = path;

      // 检查当前路径的 tab 是否存在
      const existingTab = tabs.find((t) => t.key === tabKey);

      if (!existingTab) {
        addTab({
          key: tabKey,
          title:
            matchedRoute.meta?.title ??
            matchedRoute.name ??
            matchedRoute.path,
          path: path,
          closable: matchedRoute.meta?.closable !== false,
        });
      }
    }
  }, [location.pathname]); // 只在路由变化时触发

  // 路由变化后，如果激活的不是当前路由，需要切换激活状态
  useEffect(() => {
    const path = location.pathname;
    if (activeTabKey !== path) {
      setActiveTab(path);
    }
  }, [location.pathname, activeTabKey, setActiveTab]);

  const handleTabChange = (key: string) => {
    const tab = tabs.find((t) => t.key === key);
    if (tab) {
      setActiveTab(key);
      navigate(tab.path);
    }
  };

  return { tabs, activeTabKey, cachedKeys, handleTabChange };
}

function findRoute(routes: RouteConfig[], path: string): RouteConfig | null {
  for (const route of routes) {
    if (route.path === path) {
      return route;
    }
    if (route.children) {
      const found = findRoute(route.children, path);
      if (found) return found;
    }
  }
  return null;
}

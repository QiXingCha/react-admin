import { useState, useEffect, useCallback, Suspense } from "react";
import { Layout, Button, Tooltip, Menu, Spin, Result } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useLocation, useNavigate, useOutlet } from "react-router";
import { KeepAlive, useKeepAliveRef } from "keepalive-for-react";
import { AppHeader } from "./AppHeader";
import { TabBar } from "./TabBar";
import { useKeepAliveTabs } from "../../hooks/useKeepAliveTabs";
import useRouteLoading from "@/hooks/useRouteLoading";

import { KeepAliveContext } from "../../contexts/KeepAliveContext";
import { AnimatedOutlet } from "./AnimatedOutlet";
import { RouteErrorBoundary } from "../RouteErrorBoundary";
import type { RouteConfig } from "../../types";
import styles from "./AppLayout.module.css";
import "./AppLayout.transition.css";
import useOEM from "@/hooks/useOem";

const { Sider, Content } = Layout;

interface AppLayoutProps {
  routes?: RouteConfig[];
}

function buildMenuItems(routes: RouteConfig[]): MenuProps["items"] {
  return routes
    .filter(
      (r) => r.path !== "*" && r.path !== "/403" && r.meta?.hideInMenu !== true,
    )
    .map((route) => ({
      key: route.path,
      icon: route.meta?.icon,
      label: route.meta?.title || route.name,
    }));
}

function LoadingFallback() {
  const { setLoading } = useRouteLoading();

  useEffect(() => {
    setLoading(true);
  }, [setLoading]);

  return null;
}

function AppLayout({ routes = [] }: AppLayoutProps) {
  const { loading, setLoading } = useRouteLoading();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const config = useOEM();
  const outlet = useOutlet();
  const aliveRef = useKeepAliveRef();
  const { tabs, activeTabKey, cachedKeys, handleTabChange } =
    useKeepAliveTabs(routes);

  const handleRouteError = useCallback(
    (error: Error) => {
      setLoading(false);
      if (import.meta.env.DEV) {
        console.error("[AppLayout] route error:", error);
      }
    },
    [setLoading],
  );

  const renderRouteError = useCallback(
    (error: Error, reset: () => void) => (
      <Result
        status="error"
        title="页面加载失败"
        subTitle={error.message || "发生未知错误，请稍后再试"}
        extra={[
          <Button key="retry" type="primary" onClick={reset}>
            重试
          </Button>,
          <Button key="reload" onClick={() => window.location.reload()}>
            刷新页面
          </Button>,
        ]}
      />
    ),
    [],
  );

  const menuItems = buildMenuItems(routes);
  const currentCacheKey = location.pathname;

  const getBreadcrumbItems = () => {
    const items: { title: string }[] = [];
    const pathSnippets = location.pathname.split("/").filter((i) => i);

    let currentPath = "";
    pathSnippets.forEach((snippet) => {
      currentPath += `/${snippet}`;
      const route = findRouteByPath(routes, currentPath);
      if (route) {
        items.push({
          title: route.meta?.title ?? route.name ?? route.path,
        });
      }
    });

    return items;
  };

  const handleRefresh = () => {
    // 使用 aliveRef 刷新当前缓存
    aliveRef.current?.refresh(activeTabKey);
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };

  const activePath = location.pathname;

  return (
    <KeepAliveContext.Provider value={{ aliveRef }}>
      <Layout className={styles.layout}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={240}
          collapsedWidth={64}
          className={styles.sider}
        >
          <div className={styles.logo}>
            {!collapsed && (
              <span className={styles.logoText}>{config.clientName}</span>
            )}
            {collapsed && <span className={styles.logoIcon}>A</span>}
          </div>
          <Menu
            mode="inline"
            theme="light"
            selectedKeys={[activePath]}
            items={menuItems}
            onClick={handleMenuClick}
            inlineCollapsed={collapsed}
            className={styles.menu}
          />
        </Sider>
        <Layout
          className={`${styles.mainLayout} ${collapsed ? styles.mainLayoutCollapsed : ""}`}
        >
          <AppHeader
            breadcrumbItems={[{ title: "首页" }, ...getBreadcrumbItems()]}
          />
          <div className={styles.tabBarWrapper}>
            <TabBar
              tabs={tabs}
              activeTabKey={activeTabKey}
              onTabChange={handleTabChange}
            />
            <div className={styles.tabBarActions}>
              <Tooltip title="刷新当前页">
                <Button
                  type="text"
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                />
              </Tooltip>
              <Button
                type="text"
                size="small"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
            </div>
          </div>
          <Content className={styles.content}>
            <RouteErrorBoundary
              resetKey={location.pathname}
              onError={handleRouteError}
              fallback={renderRouteError}
            >
              <KeepAlive
                activeCacheKey={currentCacheKey}
                include={cachedKeys}
                max={8}
                aliveRef={aliveRef}
                transition
                duration={220}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <AnimatedOutlet>{outlet}</AnimatedOutlet>
                </Suspense>
              </KeepAlive>
            </RouteErrorBoundary>
            {loading && (
              <div className={styles.loadingOverlay}>
                <Spin size="large" />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </KeepAliveContext.Provider>
  );
}

export default AppLayout;

function findRouteByPath(
  routes: RouteConfig[],
  path: string,
): RouteConfig | null {
  for (const route of routes) {
    if (route.path === path) {
      return route;
    }
    if (route.children) {
      const found = findRouteByPath(route.children, path);
      if (found) return found;
    }
  }
  return null;
}

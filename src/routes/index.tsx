import { Routes, Route, Navigate } from "react-router";
import type { ComponentType } from "react";
import type { RouteConfig } from "../types";
import useAuth from "@/hooks/useAuth";
import { AuthGuard } from "../components/AuthGuard";

type LayoutComponent = ComponentType<{ routes: RouteConfig[] }>;

function wrapWithGuard(route: RouteConfig, element: React.ReactNode) {
  const requiresAuth = route.meta?.requiresAuth ?? true;
  const roles = route.meta?.roles;
  return (
    <AuthGuard requiresAuth={requiresAuth} roles={roles}>
      {element}
    </AuthGuard>
  );
}

function renderRoutes(
  routeList: RouteConfig[],
  accessibleChildren?: RouteConfig[],
) {
  return routeList.map((route) => {
    const hasChildren = !!route.children?.length;
    let element: React.ReactNode;

    if (hasChildren) {
      const Layout = route.component as LayoutComponent;
      const layoutRoutes =
        route.name === "AppLayout" && accessibleChildren
          ? accessibleChildren
          : route.children!;
      element = <Layout routes={layoutRoutes} />;
    } else {
      const Component = route.component;
      element = <Component />;
    }

    const isLayoutHost = route.name === "AppLayout";

    return (
      <Route
        key={route.path}
        path={route.path}
        element={wrapWithGuard(route, element)}
      >
        {isLayoutHost && (
          <Route index element={<Navigate to="/dashboard" replace />} />
        )}
        {hasChildren && renderRoutes(route.children!)}
      </Route>
    );
  });
}

function RouterContainer() {
  const { routes, accessibleRoutes, initialized } = useAuth();

  if (!initialized) return null;

  return <Routes>{renderRoutes(routes, accessibleRoutes)}</Routes>;
}

export default RouterContainer;

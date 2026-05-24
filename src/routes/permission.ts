import type { RouteConfig } from "../types";

/**
 * 判断单个路由是否对给定角色集合可见。
 * - 未配置 meta.roles 或为空数组：任何登录用户都可访问
 * - 配置了 roles：用户角色与之有交集才可访问
 */
export function hasRoutePermission(
  route: RouteConfig,
  userRoles: string[],
): boolean {
  const required = route.meta?.roles;
  if (!required || required.length === 0) return true;
  return required.some((r) => userRoles.includes(r));
}

/**
 * 递归过滤路由树，剔除当前用户无权限的节点。
 * 注意：对于含子路由的容器节点，仅当其至少有一个子节点可访问时才保留。
 */
export function filterRoutesByRoles(
  routes: RouteConfig[],
  userRoles: string[],
): RouteConfig[] {
  const result: RouteConfig[] = [];

  for (const route of routes) {
    if (!hasRoutePermission(route, userRoles)) continue;

    if (route.children && route.children.length > 0) {
      const accessibleChildren = filterRoutesByRoles(route.children, userRoles);
      if (accessibleChildren.length === 0) continue;
      result.push({ ...route, children: accessibleChildren });
    } else {
      result.push({ ...route });
    }
  }

  return result;
}

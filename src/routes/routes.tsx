/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { RouteConfig } from "../types";
import AppLayout from "../components/Layout/AppLayout";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const UserList = lazy(() => import("../pages/UserList"));
const UserDetail = lazy(() => import("../pages/UserDetail"));
const RoleList = lazy(() => import("../pages/RoleList"));
const SystemSettings = lazy(() => import("../pages/SystemSettings"));
const PermissionDenied = lazy(() => import("../pages/PermissionDenied"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../pages/Login"));

/**
 * 静态路由：不依赖权限，始终注册。
 * `AppLayout` 是一个占位标记，auth store 会在运行时把 asyncRoutes 注入到它的 children。
 */
export const constantRoutes: RouteConfig[] = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "登录",
      requiresAuth: false,
    },
  },
  {
    path: "/",
    name: "AppLayout",
    component: AppLayout,
    meta: {
      title: "Layout",
      requiresAuth: true,
    },
    children: [
      {
        path: "/403",
        name: "PermissionDenied",
        component: PermissionDenied,
        meta: {
          title: "无权限",
          hideInMenu: true,
        },
      },
    ],
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "页面不存在",
      // 默认 requiresAuth: true：
      // - 已登录访问未知路径 → 显示 NotFound
      // - 未登录访问未知路径（含退出后被卸载的路由）→ AuthGuard 兜底回 /login
    },
  },
];

/**
 * 动态路由：根据登录用户的 roles 过滤后再渲染。
 *
 * meta.roles 含义：
 * - 不配置 / 空数组：任何已登录用户均可访问
 * - 配置后：用户 roles 与之有交集即可访问
 */
export const asyncRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      title: "首页",
      icon: <DashboardOutlined />,
      closable: false,
    },
  },
  {
    path: "/users",
    name: "UserManagement",
    component: UserList,
    meta: {
      title: "用户管理",
      icon: <UserOutlined />,
      roles: ["admin", "user"],
    },
  },
  {
    path: "/user/:id",
    name: "UserDetail",
    component: UserDetail,
    meta: {
      title: "用户详情",
      closable: true,
      hideInMenu: true,
      roles: ["admin", "user"],
    },
  },
  {
    path: "/roles",
    name: "RoleManagement",
    component: RoleList,
    meta: {
      title: "角色管理",
      icon: <TeamOutlined />,
      roles: ["admin"],
    },
  },
  {
    path: "/settings",
    name: "SystemSettings",
    component: SystemSettings,
    meta: {
      title: "系统设置",
      icon: <SettingOutlined />,
      roles: ["admin"],
    },
  },
];

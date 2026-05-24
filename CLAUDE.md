# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

React 19 + Vite + TypeScript 后台管理系统，包含基于角色的路由、持久化标签页导航和中文本地化。使用 Ant Design 6 作为 UI 库，`keepalive-for-react` 实现标签页缓存。

## 常用命令

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 生产构建（类型检查 + vite build）
pnpm lint     # 运行 ESLint
pnpm preview  # 预览生产构建
```

## 架构

### 路由系统

路由分为两组：

- **constantRoutes**（`src/routes/routes.tsx`）— 静态路由，始终注册：`/login`、AppLayout 外壳、`/403`、`*`（NotFound）
- **asyncRoutes**（`src/routes/routes.tsx`）— 动态路由，根据用户角色在运行时过滤：Dashboard、UserManagement、RoleManagement、SystemSettings

**路由注入模式**：`authStore`（Zustand）根据用户角色过滤 `asyncRoutes`，然后将可访问的路由作为 `children` 注入到 `AppLayout` 路由下。AppLayout 组件通过 prop 接收所有路由并从中渲染侧边栏菜单。

### 认证流程

1. `authStore` 初始化时从 `localStorage` 读取已存储的认证信息
2. `login()` 将 `{ token, user }` 存入 localStorage
3. `logout()` 清除存储、重置会话，并调用 `tabsStore.resetTabs()`
4. `hasRole(roles)` 检查用户是否拥有指定角色（任意一个即可）
5. `filterRoutesByRoles()`（`src/routes/permission.ts`）递归过滤路由树

### 标签页持久化

`tabsStore` 通过 `keepalive-for-react` 管理带缓存的标签栏：
- 最多 20 个标签，达到上限时 LRU 淘汰
- 不可关闭的标签（如 Dashboard）不会被淘汰
- `KeepAliveContext` 提供 `aliveRef` 用于刷新操作

**注意**：`keepalive-for-react` 不支持 React StrictMode。`main.tsx` 中已刻意省略 StrictMode。

### 核心文件

| 文件 | 职责 |
|------|------|
| `src/App.tsx` | 根组件（ConfigProvider + BrowserRouter + 路由） |
| `src/routes/routes.tsx` | 路由定义（constant + async） |
| `src/routes/permission.ts` | 基于角色的路由过滤 |
| `src/routes/index.tsx` | 路由渲染（含懒加载和 AuthGuard） |
| `src/stores/authStore.ts` | 认证状态、路由组装、持久化 |
| `src/stores/tabsStore.ts` | 标签页状态与缓存 key |
| `src/stores/routeLoadingStore.ts` | 路由 loading + 顶部 NProgress |
| `src/components/Layout/AppLayout.tsx` | 主布局（侧边栏、标签栏、内容区） |
| `src/hooks/useAuth.ts` | `authStore` 的 React 选择器封装 |
| `src/hooks/useKeepAliveTabs.ts` | 标签页切换逻辑 |

### 路径别名

`@` 指向 `src/`，在 `src/` 任意位置均可使用 `@/` 开头的导入路径。

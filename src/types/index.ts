export interface Tab {
  key: string;
  title: string;
  path: string;
  closable?: boolean;
  lastTime?: number;
}

export interface TabContextState {
  tabs: Tab[];
  activeTabKey: string;
}

export interface TabContextActions {
  addTab: (tab: Tab) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  clearCache: (key: string) => void;
  clearAllCache: () => void;
  /** 将标签栏与缓存 key 恢复为初始状态（仅保留不可关闭的标签，如首页） */
  resetTabs: () => void;
}

export interface RouteMeta {
  title: string;
  icon?: React.ReactNode;
  closable?: boolean;
  hideInMenu?: boolean;
  cacheable?: boolean;
  /**
   * 允许访问该路由的角色列表。
   * - 不配置 / 为空数组：登录后即可访问
   * - 配置后：用户的 roles 与该数组有交集才能访问
   */
  roles?: string[];
  /** 标记是否为登录后才可访问的页面，默认 true */
  requiresAuth?: boolean;
}

export interface RouteConfig {
  path: string;
  name?: string;
  /** 布局路由会传入 `routes`；页面组件可忽略该 prop */
  component: React.ComponentType<{ routes?: RouteConfig[] }>;
  meta?: RouteMeta;
  children?: RouteConfig[];
}

export interface UserInfo {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  roles: string[];
}

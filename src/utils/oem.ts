import { type ThemeConfig } from "antd";

type OEMConfig = {
  [key: string]: unknown;
} & ThemeConfig;

export type OutputConfig = {
  clientName: string;
  logo: string;
  theme: {
    primary: string;
    success: string;
    warning: string;
    background: string;
  };
  copyright: string;
  apiBaseUrl: string;
  showFooter: boolean;
  showHeader: boolean;
};

/** 单租户 OEM 行（可按 clientCode 扩展或由接口返回） */
type OemRow = {
  clientName: string;
  logo: string;
  colorPrimary: string;
  copyright: string;
  apiBaseUrl: string;
};

const OEM_BY_CLIENT: Record<string, OemRow> = {
  clientA: {
    clientName: "客户A",
    logo: "/logos/clientA.png",
    colorPrimary: "#fa8c16",
    copyright: "© 2025 客户A 科技",
    apiBaseUrl: "https://api.clientA.com",
  },
  clientB: {
    clientName: "客户B",
    logo: "/logos/clientB.png",
    colorPrimary: "#1677ff",
    copyright: "© 2025 客户B 科技",
    apiBaseUrl: "https://api.clientB.com",
  },
  default: {
    clientName: "默认租户",
    logo: "/logos/default.png",
    colorPrimary: "#1677ff",
    copyright: "© 2025 Admin",
    apiBaseUrl: "/api",
  },
};

const FONT_FALLBACK =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/**
 * ① 从域名解析租户 clientCode（生产可改为配置中心 / 通配证书域等）
 */
export function resolveClientFromHost(host: string): string | null {
  const h = host.toLowerCase();
  if (h.includes("clienta.")) return "clientA";
  if (h.includes("clientb.")) return "clientB";
  return null;
}

/**
 * 无租户前缀时，首段即为真实路由（如 /login、/dashboard），不能当作 clientCode。
 */
const ROOT_APP_ROUTE_SEGMENTS = new Set([
  "login",
  "403",
  "dashboard",
  "users",
  "user",
  "roles",
  "settings",
]);

function normalizeClientSlug(segment: string): string | null {
  if (!/^[a-zA-Z0-9_-]+$/i.test(segment)) return null;
  return segment;
}

/**
 * 从路径解析租户码：`/{clientCode}/...`
 */
export function parseClientCodeFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const first = segments[0];
  if (ROOT_APP_ROUTE_SEGMENTS.has(first)) return null;

  if (segments.length >= 2) {
    return normalizeClientSlug(first);
  }

  return normalizeClientSlug(first);
}

/**
 * ② 综合得到当前 OEM 所用的 clientCode（用于拉配置、主题）：
 * 域名 → ?client= → 路径前缀 → localStorage → default
 */
export function getOemClientCode(): string {
  const fromHost = resolveClientFromHost(window.location.host);
  if (fromHost) return fromHost;

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("client");
  if (fromQuery) {
    const slug = normalizeClientSlug(fromQuery);
    if (slug) return slug;
  }

  const fromPath = parseClientCodeFromPathname(window.location.pathname);
  if (fromPath) return fromPath;

  return localStorage.getItem("clientCode") || "default";
}

/**
 * 供 `BrowserRouter` 的 `basename`：仅从路径与 `?client=` 解析，
 * 不用域名/localStorage，避免纯主机访问 `/login` 时被拼成 `/default/login`。
 */
export function getRouterBasename(): string | undefined {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("client");
  if (fromQuery) {
    const slug = normalizeClientSlug(fromQuery);
    if (slug) return `/${slug}`;
  }
  const fromPath = parseClientCodeFromPathname(window.location.pathname);
  if (fromPath) return `/${fromPath}`;
  return undefined;
}

/** @alias 与 getOemClientCode 相同，供历史命名使用 */
export const getClientCode = getOemClientCode;

function buildLoadedConfig(clientCode: string) {
  const row = OEM_BY_CLIENT[clientCode] ?? OEM_BY_CLIENT.default;
  const primary = row.colorPrimary;

  return {
    clientName: row.clientName,
    logo: row.logo,
    theme: {
      primary,
      success: "#52c41a",
      warning: "#faad14",
      background: "#f5f5f5",
    },
    token: {
      colorPrimary: primary,
      borderRadius: 6,
      fontFamily: FONT_FALLBACK,
    },
    copyright: row.copyright,
    apiBaseUrl: row.apiBaseUrl,
    showFooter: true,
    showHeader: true,
  };
}

/**
 * ③ 按 clientCode 加载 OEM（此处为本地表；可改为 `fetch(apiBaseUrl + '/oem/' + clientCode)`）
 */
export async function loadOEMConfig() {
  const clientCode = getOemClientCode();
  // 预留：await fetch(...)
  return buildLoadedConfig(clientCode);
}

export type LoadedOEMConfig = Awaited<ReturnType<typeof loadOEMConfig>>;

export function mergeConfig(config: LoadedOEMConfig): OEMConfig {
  return { ...config };
}

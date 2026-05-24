import { createContext, useState, useEffect, type ReactNode } from "react";
import { Spin } from "antd";
import { loadOEMConfig, type LoadedOEMConfig } from "@/utils/oem";

export const OEMContext = createContext<LoadedOEMConfig | null>(null);

function applyThemeCssVars(config: LoadedOEMConfig) {
  const { theme } = config;
  if (!theme || typeof theme !== "object") return;
  Object.entries(theme as Record<string, unknown>).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      document.documentElement.style.setProperty(`--${key}`, value);
    }
  });
}

const OEMProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<LoadedOEMConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const oemConfig = await loadOEMConfig();
        if (cancelled) return;
        applyThemeCssVars(oemConfig);
        setConfig(oemConfig);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      }
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "system-ui, sans-serif",
          color: "#262626",
        }}
      >
        OEM 配置加载失败：{error.message}
      </div>
    );
  }

  if (config === null) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <Spin size="large" description="正在加载 OEM 配置…" />
      </div>
    );
  }

  return <OEMContext.Provider value={config}>{children}</OEMContext.Provider>;
};

export default OEMProvider;

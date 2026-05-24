import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

/** 
 * 仅对框架类依赖做稳定拆包；antd/rc-* 不手动打成一个 chunk，
 * 否则会强制合并整棵组件树，容易出现单个 vendor-antd 极大。
 * 其余交给 Rollup 按共享依赖与路由懒加载自动切块。
 */
function manualChunks(id: string): string | undefined {
  if (!id.includes("node_modules")) {
    return undefined;
  }

  if (
    id.includes("node_modules/react/") ||
    id.includes("node_modules/react-dom/") ||
    id.includes("node_modules/scheduler/") ||
    id.includes("use-sync-external-store")
  ) {
    return "vendor-react";
  }

  if (id.includes("react-router")) {
    return "vendor-router";
  }

  if (id.includes("@ant-design/icons")) {
    return "vendor-antd-icons";
  }

  if (id.includes("axios") || id.includes("/swr/")) {
    return "vendor-data";
  }

  if (id.includes("keepalive-for-react")) {
    return "vendor-keepalive";
  }

  if (id.includes("zustand") || id.includes("nprogress")) {
    return "vendor-utils";
  }

  return undefined;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    mode === "analyze" &&
      visualizer({
        filename: path.resolve(__dirname, "dist/stats.html"),
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
}));

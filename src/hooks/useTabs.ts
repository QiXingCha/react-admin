import { useShallow } from "zustand/react/shallow";
import type { TabContextState, TabContextActions } from "../types";
import { useTabsStore } from "@/stores/tabsStore";

export type TabsContextValue = TabContextState &
  TabContextActions & { cachedKeys: string[] };

export function useTabs(): TabsContextValue {
  return useTabsStore(
    useShallow((s) => ({
      tabs: s.tabs,
      activeTabKey: s.activeTabKey,
      cachedKeys: s.cachedKeys,
      addTab: s.addTab,
      removeTab: s.removeTab,
      setActiveTab: s.setActiveTab,
      clearCache: s.clearCache,
      clearAllCache: s.clearAllCache,
      resetTabs: s.resetTabs,
    })),
  );
}

export default useTabs;

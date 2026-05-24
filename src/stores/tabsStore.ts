import { create } from "zustand";
import type { Tab, TabContextState, TabContextActions } from "@/types";

const MAX_TABS = 20;

interface TabItem extends Tab {
  lastTime: number;
}

interface TabsState extends TabContextState {
  cachedKeys: string[];
}

type TabsAction =
  | { type: "ADD_TAB"; payload: Tab }
  | { type: "REMOVE_TAB"; payload: string }
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "CLEAR_CACHE"; payload: string }
  | { type: "CLEAR_ALL_CACHE" }
  | { type: "RESET_TABS" };

function createInitialState(): TabsState {
  const now = Date.now();
  return {
    tabs: [
      {
        key: "/dashboard",
        title: "首页",
        path: "/dashboard",
        closable: false,
        lastTime: now,
      },
    ],
    activeTabKey: "/dashboard",
    cachedKeys: ["/dashboard"],
  };
}

const initialState: TabsState = createInitialState();

function tabsReducer(state: TabsState, action: TabsAction): TabsState {
  switch (action.type) {
    case "ADD_TAB": {
      const existsTab = state.tabs.find((t) => t.key === action.payload.key);
      if (existsTab) {
        return {
          ...state,
          activeTabKey: action.payload.key,
        };
      }

      let newTabs: TabItem[] = state.tabs.map((t) => ({
        ...t,
        lastTime: t.lastTime || Date.now(),
      }));
      const newCacheKeys = [...state.cachedKeys];

      if (
        !action.payload.closable &&
        !newCacheKeys.includes(action.payload.key)
      ) {
        newCacheKeys.push(action.payload.key);
      }

      if (newTabs.length >= MAX_TABS) {
        const closableTabs = newTabs.filter((t) => t.closable !== false);
        if (closableTabs.length > 0) {
          const oldestClosable = closableTabs.reduce((prev, curr) =>
            (prev.lastTime || 0) < (curr.lastTime || 0) ? prev : curr,
          );
          newTabs = newTabs.filter((t) => t.key !== oldestClosable.key);
          const keyToRemove = oldestClosable.key;
          if (newCacheKeys.includes(keyToRemove)) {
            const idx = newCacheKeys.indexOf(keyToRemove);
            newCacheKeys.splice(idx, 1);
          }
        }
      }

      newTabs.push({
        ...action.payload,
        lastTime: Date.now(),
        closable: action.payload.closable !== false,
      });

      if (!newCacheKeys.includes(action.payload.key)) {
        newCacheKeys.push(action.payload.key);
      }

      return {
        ...state,
        tabs: newTabs,
        activeTabKey: action.payload.key,
        cachedKeys: newCacheKeys,
      };
    }

    case "REMOVE_TAB": {
      const targetIndex = state.tabs.findIndex((t) => t.key === action.payload);
      const newTabs = state.tabs.filter((t) => t.key !== action.payload);
      const newCacheKeys = state.cachedKeys.filter((k) => k !== action.payload);

      let newActiveKey = state.activeTabKey;
      if (state.activeTabKey === action.payload) {
        const rightTab = state.tabs[targetIndex + 1];
        const leftTab = state.tabs[targetIndex - 1];
        newActiveKey = rightTab?.key || leftTab?.key || "/dashboard";
      }

      return {
        ...state,
        tabs: newTabs,
        activeTabKey: newActiveKey,
        cachedKeys: newCacheKeys,
      };
    }

    case "SET_ACTIVE_TAB": {
      const newTabs = state.tabs.map((t) =>
        t.key === action.payload ? { ...t, lastTime: Date.now() } : t,
      );
      return {
        ...state,
        tabs: newTabs,
        activeTabKey: action.payload,
      };
    }

    case "CLEAR_CACHE": {
      return {
        ...state,
        cachedKeys: state.cachedKeys.filter((k) => k !== action.payload),
      };
    }

    case "CLEAR_ALL_CACHE": {
      return {
        ...state,
        cachedKeys: state.tabs
          .filter((t) => t.closable === false)
          .map((t) => t.key),
      };
    }

    case "RESET_TABS":
      return createInitialState();

    default:
      return state;
  }
}

export type TabsStore = TabsState &
  TabContextActions & { resetTabs: () => void };

function slice(s: TabsState): TabsState {
  return {
    tabs: s.tabs,
    activeTabKey: s.activeTabKey,
    cachedKeys: s.cachedKeys,
  };
}

export const useTabsStore = create<TabsStore>((set) => ({
  ...initialState,
  addTab: (tab) =>
    set((s) => {
      const next = tabsReducer(slice(s), { type: "ADD_TAB", payload: tab });
      return {
        tabs: next.tabs,
        activeTabKey: next.activeTabKey,
        cachedKeys: next.cachedKeys,
      };
    }),
  removeTab: (key) =>
    set((s) => {
      const next = tabsReducer(slice(s), { type: "REMOVE_TAB", payload: key });
      return {
        tabs: next.tabs,
        activeTabKey: next.activeTabKey,
        cachedKeys: next.cachedKeys,
      };
    }),
  setActiveTab: (key) =>
    set((s) => {
      const next = tabsReducer(slice(s), {
        type: "SET_ACTIVE_TAB",
        payload: key,
      });
      return {
        tabs: next.tabs,
        activeTabKey: next.activeTabKey,
        cachedKeys: next.cachedKeys,
      };
    }),
  clearCache: (key) =>
    set((s) => {
      const next = tabsReducer(slice(s), { type: "CLEAR_CACHE", payload: key });
      return {
        tabs: next.tabs,
        activeTabKey: next.activeTabKey,
        cachedKeys: next.cachedKeys,
      };
    }),
  clearAllCache: () =>
    set((s) => {
      const next = tabsReducer(slice(s), { type: "CLEAR_ALL_CACHE" });
      return {
        tabs: next.tabs,
        activeTabKey: next.activeTabKey,
        cachedKeys: next.cachedKeys,
      };
    }),
  resetTabs: () => set(createInitialState()),
}));

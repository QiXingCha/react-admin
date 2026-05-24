import { useTabsStore } from "@/stores/tabsStore";

function useCachedKeys(): string[] {
  return useTabsStore((s) => s.cachedKeys);
}

export default useCachedKeys;

import { useShallow } from "zustand/react/shallow";
import { useRouteLoadingStore } from "@/stores/routeLoadingStore";

export interface RouteLoadingContextValue {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

function useRouteLoading(): RouteLoadingContextValue {
  return useRouteLoadingStore(
    useShallow((s) => ({
      loading: s.loading,
      setLoading: s.setLoading,
    })),
  );
}

export default useRouteLoading;

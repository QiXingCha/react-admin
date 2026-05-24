import { create } from "zustand";
import NProgress from "nprogress";

export const useRouteLoadingStore = create<{
  loading: boolean;
  setLoading: (value: boolean) => void;
}>((set) => ({
  loading: false,
  setLoading: (value) => {
    set({ loading: value });
    if (value) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  },
}));

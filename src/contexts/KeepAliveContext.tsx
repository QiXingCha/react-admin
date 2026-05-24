import { createContext, useContext } from "react";
import type { KeepAliveRef } from "keepalive-for-react";

interface KeepAliveContextValue {
  aliveRef: React.RefObject<KeepAliveRef | null>;
}

export const KeepAliveContext = createContext<KeepAliveContextValue | null>(
  null,
);

export function useAliveRef(): React.RefObject<KeepAliveRef | null> {
  const context = useContext(KeepAliveContext);
  if (!context) {
    throw new Error("useAliveRef must be used within KeepAliveProvider");
  }
  return context.aliveRef;
}

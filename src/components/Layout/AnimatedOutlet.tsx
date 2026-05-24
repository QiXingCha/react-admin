import { useRef, useLayoutEffect, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import useRouteLoading from "@/hooks/useRouteLoading";

interface AnimatedOutletProps {
  children: ReactNode;
}

const ENTER_CLASS = "route-outlet--enter";

export function AnimatedOutlet({ children }: AnimatedOutletProps) {
  const location = useLocation();
  const nodeRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useRouteLoading();

  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    node.classList.remove(ENTER_CLASS);
    void node.offsetWidth;
    node.classList.add(ENTER_CLASS);
  }, [location.pathname]);

  useEffect(() => {
    setLoading(false);
  }, [location.pathname, setLoading]);

  return (
    <div ref={nodeRef} className="route-outlet">
      {children}
    </div>
  );
}

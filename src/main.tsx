import { createRoot } from "react-dom/client";
import App from "./App";
import OEMProvider from "@/contexts/OemContext";
import "./bootstrap";
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks");
    return worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <OEMProvider>
      <App />
    </OEMProvider>,
  );
});

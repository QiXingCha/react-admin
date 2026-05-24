import { useContext } from "react";
import { OEMContext } from "@/contexts/OemContext";
import type { LoadedOEMConfig } from "@/utils/oem";

const useOEM = (): LoadedOEMConfig => {
  const ctx = useContext(OEMContext);
  if (ctx === null) {
    throw new Error(
      "useOEM must be used within OEMProvider after OEM config is ready",
    );
  }
  return ctx;
};

export default useOEM;

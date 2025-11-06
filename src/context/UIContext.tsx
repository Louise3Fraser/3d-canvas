import { createContext, type ReactNode, useContext, useState } from "react";
import { type UIContextType } from "../types/uiTypes";

export const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [modeIndex, setModeIndex] = useState<number>(0);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [theme, setTheme] = useState<
    "gradient-1" | "gradient-2" | "gradient-3"
  >("gradient-1");

  return (
    <UIContext.Provider
      value={{
        modeIndex,
        setModeIndex,
        showGrid,
        setShowGrid,
        theme,
        setTheme,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("uh oh... useModel not in a ModelProvider");
  }
  return context;
};

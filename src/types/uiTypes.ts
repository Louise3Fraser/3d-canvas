export interface UIContextType {
  modeIndex: number;
  setModeIndex: (i: number) => void;
  showGrid: boolean;
  setShowGrid: (b: boolean) => void;
  theme: "gradient-1" | "gradient-2" | "gradient-3";
  setTheme: (t: any) => void;
}

export interface SelectionContextType {
  selected: string | null;
  setSelected: (id: string | null) => void;
  edit: boolean;
  toggleItem: (id: string) => void;
}

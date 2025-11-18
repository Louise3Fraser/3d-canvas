import { useState } from "react";
import {
  Box,
  Circle,
  Cone,
  Cylinder,
  Focus,
  Folder,
  Grid2X2Check,
  Grid2x2X,
  RectangleVertical,
  Redo,
  Shapes,
  Torus,
  Trash,
  Undo,
} from "lucide-react";
import Dropdown from "../../components/Dropdown";
import Toggle from "../../components/Toggle";
import Tooltip from "../../components/Tooltip";
import { useModel } from "../../context/ModelContext";
import { useUI } from "../../context/UIContext";
import type { PrimitiveType } from "../../types/modelTypes";

const ICONS: any = {
  box: Box,
  sphere: Circle,
  cylinder: Cylinder,
  cone: Cone,
  torus: Torus,
  capsule: RectangleVertical,
};

const SHAPE_LABELS: Record<string, PrimitiveType> = {
  box: "box",
  sphere: "sphere",
  cylinder: "cylinder",
  cone: "cone",
  torus: "torus",
  capsule: "capsule",
};

const PRIMITIVES = Object.keys(ICONS) as PrimitiveType[];

export default function Toolbar() {
  const { setModeIndex, modeIndex, showGrid, setShowGrid, theme } = useUI();
  const { addPrimitive, deleteAll, addGroup, undo, redo, canUndo, canRedo } =
    useModel();
  const [shape, setShape] = useState<PrimitiveType | "">("");

  const handleRecenter = () => {
    window.dispatchEvent(new Event("recenter-camera"));
  };

  const options = PRIMITIVES.map((type) => {
    const Icon = ICONS[type];
    return {
      value: type,
      label: SHAPE_LABELS[type] || type,
      icon: <Icon className="w-4 h-4 text-main" />,
    };
  });

  return (
    <div
      className={`absolute flex flex-row gap-6 items-center rounded-pill z-10 m-3 px-5 py-1.5 ${theme} shadow-sm border`}
    >
      <Tooltip text="Add primitive">
        <Dropdown
          value={shape}
          onChange={(val) => {
            setShape(val);
            addPrimitive(val, "root");
          }}
          options={options}
          mainIcon={<Shapes className="h-5 w-5 text-main" />}
        />
      </Tooltip>
      <Tooltip text="Add group">
        <Folder
          onClick={addGroup}
          className="w-5 h-5 cursor-pointer text-main"
        />
      </Tooltip>
      <div className="w-px h-6 bg-border" />
      <Tooltip text="Undo">
        <Undo
          onClick={canUndo ? undo : undefined}
          className={`w-5 h-5 ${
            canUndo
              ? "text-main cursor-pointer"
              : "text-muted opacity-50 cursor-not-allowed"
          }`}
        />
      </Tooltip>
      <Tooltip text="Redo">
        <Redo
          onClick={canRedo ? redo : undefined}
          className={`w-5 h-5 ${
            canRedo
              ? "text-main cursor-pointer"
              : "text-muted opacity-50 cursor-not-allowed"
          }`}
        />
      </Tooltip>
      <div className="w-px h-6 bg-border" />
      <Tooltip text="Grid visibility">
        {showGrid ? (
          <Grid2X2Check
            className="h-5 w-5 text-main cursor-pointer"
            onClick={() => setShowGrid(false)}
          />
        ) : (
          <Grid2x2X
            className="h-5 w-5 text-main cursor-pointer"
            onClick={() => setShowGrid(true)}
          />
        )}
      </Tooltip>
      <Tooltip text="Recenter">
        <Focus
          onClick={handleRecenter}
          className="w-5 h-5 cursor-pointer text-main"
        />
      </Tooltip>
      <Tooltip text="Control mode">
        <div className="flex gap-1 justify-center">
          <Toggle
            isLeft={modeIndex === 0}
            onClick={() => setModeIndex(modeIndex === 0 ? 1 : 0)}
          />
        </div>
      </Tooltip>

      <Tooltip text="Clear canvas">
        <Trash
          onClick={() => {
            if (confirm("Delete entire canvas?")) {
              return deleteAll();
            }
          }}
          className="w-4.5 h-4.5 cursor-pointer text-main"
        />
      </Tooltip>
    </div>
  );
}

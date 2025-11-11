import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Box,
  Circle,
  Cone,
  Copy,
  Cylinder,
  Folder,
  RectangleVertical,
  Torus,
  Trash,
} from "lucide-react";
import { useModel } from "../../../context/ModelContext";
import { useUI } from "../../../context/UIContext";
import { findNode } from "../../../utils/modelUtiils";

const ICONS = {
  group: Folder,
  box: Box,
  cylinder: Cylinder,
  cone: Cone,
  sphere: Circle,
  torus: Torus,
  capsule: RectangleVertical,
} as const;

const SectionHeader = ({
  title,
  border,
}: {
  title: string;
  border: boolean;
}) => (
  <div className="mb-3 mt-6">
    {border ? <div className="h-px bg-border" /> : <></>}
    <h2 className="mt-3">{title}</h2>
  </div>
);

export default function Edit() {
  const { setModeIndex } = useUI();
  const { model, selected, updateItem, deleteItem, duplicate } = useModel();
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const item = selected ? findNode(model, selected) : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  if (!item) {
    return <div className="text-sm text-grey-400">Select an item to edit</div>;
  }

  const Icon = ICONS[item.type];

  if (item.type === "group") {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-5 h-5 text-main" />
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateItem(item.id, { name: e.target.value })}
            className="flex-1 px-2 py-1 text-sm text-grey-500 bg-white border border-border rounded"
          />
        </div>
        <div className="text-sm text-grey">
          Group with {item.children.length} item(s)
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-[-5px] mb-5">
      <SectionHeader title="Basic" border={false} />
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p>Name</p>
          <div className="flex items-center gap-2">
            <input
              value={item.name}
              onChange={(e) => updateItem(item.id, { name: e.target.value })}
              className="flex-1 p-1 text-grey-500 text-xs w-27.5 text-center border rounded-sm bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between">
            <p>Color</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={item.color}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    updateItem(item.id, { color: value });
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    e.target.value = item.color;
                  }
                }}
                className="w-16.5 px-2 py-1 text-grey-500 text-xs font-mono text-center border rounded-sm bg-white focus:outline-none"
              />
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="w-9 h-5 rounded-sm border border-border transition-all cursor-pointer"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </div>
          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute right-0 top-full mt-2 z-50"
            >
              <HexColorPicker
                color={item.color}
                onChange={(color) => {
                  updateItem(item.id, { color });
                }}
                className="custom-picker"
              />
            </div>
          )}
        </div>
      </div>
      <SectionHeader title="Dimensions" border={true} />
      <div className="space-y-1.5">
        {(
          [
            "Width",
            "Height",
            "Depth",
            "Radius",
            "RadiusBottom",
            "RadiusTop",
            "RadialSegments",
            "TubularSegments",
            "TubeRadius",
            "Arc",
            "CapSegments",
          ] as const
        ).map((label) => {
          const key = label as keyof typeof item.dimensions;
          if (!(key in item.dimensions)) return null;

          return (
            <div
              key={label}
              className="flex flex-row justify-between items-center"
            >
              <p>{label}</p>
              <input
                type="number"
                step="0.1"
                value={item.dimensions[key]}
                onChange={(e) => {
                  updateItem(item.id, {
                    dimensions: {
                      ...item.dimensions,
                      [key]: parseFloat(e.target.value) || 1,
                    },
                  });
                }}
                className="w-12 p-1 text-grey-500 text-xs text-center border rounded-sm bg-white focus:outline-none"
              />
            </div>
          );
        })}
      </div>
      <SectionHeader title="Position" border={true} />

      <div className="flex gap-2">
        {(["x", "y", "z"] as const).map((axis, idx) => (
          <div key={axis} className="flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs text-grey-400uppercase">{axis}</span>
              <input
                type="number"
                step="0.1"
                value={item.position[idx].toFixed(2)}
                onChange={(e) => {
                  setModeIndex(0);
                  const newPosition = [...item.position] as [
                    number,
                    number,
                    number,
                  ];
                  newPosition[idx] = parseFloat(e.target.value) || 0;
                  updateItem(item.id, { position: newPosition });
                }}
                className="flex-1 p-1 text-grey-500 text-xs w-5 text-center border rounded-sm bg-white focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Rotation" border={true} />

      <div className="flex gap-2 w-full">
        {["x", "y", "z"].map((axis, idx) => (
          <div key={axis} className="flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs text-grey-400uppercase">{axis}</span>
              <input
                type="number"
                step="0.01"
                value={item.rotation[idx].toFixed(2)}
                onChange={(e) => {
                  const newRotation = [...item.rotation] as [
                    number,
                    number,
                    number,
                  ];
                  newRotation[idx] = parseFloat(e.target.value) || 0;
                  updateItem(item.id, { rotation: newRotation });
                }}
                className="flex-1 p-1 text-xs w-5 text-grey-500 text-center border rounded-sm bg-white focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Advanced" border={true} />

      <div className="flex flex-col gap-0">
        <div
          onClick={() => {
            return duplicate(item.id);
          }}
          className="flex flex-row items-center gap-3 -ml-.05px px-1 py-1.5 rounded hover:bg-grey-100 cursor-pointer"
        >
          <Copy className="h-4 w-4 text-main" />
          <p>Duplicate</p>
        </div>
        <div
          onClick={() => {
            if (confirm("Delete this object?")) {
              return deleteItem(item.id);
            }
          }}
          className="flex flex-row items-center gap-3 -ml-.05px px-1 py-1.5 rounded hover:bg-grey-100 cursor-pointer"
        >
          <Trash className="h-4 w-4 text-red-600" />
          <p className="text-red-600">Delete</p>
        </div>
      </div>
    </div>
  );
}

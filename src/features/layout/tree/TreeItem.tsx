import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  ChevronDown,
  ChevronRight,
  Circle,
  Cone,
  Cylinder,
  Folder,
  RectangleVertical,
  Torus,
} from "lucide-react";
import { useModel } from "../../../context/ModelContext";
import { type ModelItem } from "../../../types/modelTypes";

const ICONS = {
  group: Folder,
  box: Box,
  cylinder: Cylinder,
  cone: Cone,
  sphere: Circle,
  torus: Torus,
  capsule: RectangleVertical,
};

interface Props {
  id: string;
  node: ModelItem;
  value: string;
  depth: number;
  indentationWidth: number;
  collapsed?: boolean;
  onCollapse?: () => void;
}
export default function TreeItem({
  id,
  node,
  value,
  depth,
  indentationWidth,
  collapsed,
  onCollapse,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [isPressing, setIsPressing] = useState(false);
  const { setSelected, selected } = useModel();

  const isSelected = selected === node.id;
  const Icon = ICONS[node.type];
  const hasChildren = node.children?.length > 0;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    paddingLeft: depth === 0 ? 0 : `${(depth - 1) * indentationWidth}px`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full ${isDragging ? "opacity-30" : ""}`}
    >
      <div
        className={`
          group flex items-center w-full h-7 px-2 pr-4 cursor-pointer
          transition-all duration-150 gap-1 rounded-sm
          ${
            isSelected
              ? "bg-grey-100"
              : isPressing
                ? "bg-grey-200 hover:bg-grey-200"
                : "hover:bg-grey-100"
          }
        `}
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          e.stopPropagation();
          setIsPressing(true);
        }}
        onMouseUp={() => {
          if (isPressing) {
            setIsPressing(false);
            if (!isDragging) {
              setSelected(node.id);
            }
          }
        }}
        onMouseLeave={() => setIsPressing(false)}
        {...attributes}
        {...listeners}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCollapse?.();
            }}
            onPointerDown={(e) => {
              e.stopPropagation(); // prevent drag
            }}
            className="ml-0.5 cursor-pointer"
          >
            {!collapsed ? (
              <ChevronDown className="w-3.5 h-3.5 text-grey-400 transition-colors hover:text-main" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-grey-400 transition-colors hover:text-main" />
            )}
          </button>
        ) : depth > 1 ? (
          <div className="w-5 h-5" />
        ) : null}
        <div className="flex items-center flex-1 gap-1.5 rounded-md cursor-pointer">
          <Icon className="w-4 text-main" />
          <span className="text-sm text-main">{value}</span>
        </div>
      </div>
    </div>
  );
}

export type PrimitiveType =
  | "box"
  | "cylinder"
  | "cone"
  | "sphere"
  | "torus"
  | "capsule";

export interface Dimensions {
  Width?: number;
  Height?: number;
  Depth?: number;
  Radius?: number;
  RadiusTop?: number;
  RadiusBottom?: number;
  RadialSegments?: number;
  TubeRadius?: number;
  TubularSegments?: number;
  CapSegments?: number;
  Arc?: number;
}

export interface BaseModelItem {
  id: string;
  name: string;
  children: ModelItem[];
  expanded?: boolean;
}

interface GroupItem extends BaseModelItem {
  type: "group";
}

interface PrimitiveItem extends BaseModelItem {
  type: PrimitiveType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  dimensions: Partial<Dimensions>;
}

export type ModelItem = GroupItem | PrimitiveItem;

export function isGroup(item: ModelItem): item is GroupItem {
  return item.type === "group";
}

export function isPrimitive(item: ModelItem): item is PrimitiveItem {
  return item.type !== "group";
}

export interface ModelContentType {
  model: ModelItem;
  setModel: (m: ModelItem) => void;
  selected: string | null;
  setSelected: (id: string | null) => void;
  addPrimitive: (type: PrimitiveType, id: string) => void;
  toggleItem: (id: string) => void;
  edit: boolean;
  setEdit: (editable: boolean) => void;
  deleteItem: (id: string) => void;
  deleteAll: () => void;
  updateItem: (id: string, updates: Partial<ModelItem>) => void;
  addChild: (root: ModelItem, id: string, child: ModelItem) => ModelItem;
  exportModel: () => ModelItem;
  duplicate: (id: string) => void;
  addGroup: () => void;
}

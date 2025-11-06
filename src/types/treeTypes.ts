import type { ModelItem } from "./modelTypes";

export type FlattenedItem = {
  id: string;
  depth: number;
  parentId: string | null;
  node: ModelItem;
};

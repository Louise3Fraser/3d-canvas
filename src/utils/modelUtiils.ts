import { type ModelItem } from "../types/modelTypes";

export const findNode = (root: ModelItem, id: string): ModelItem | null => {
  if (root.id === id) return root;

  for (const child of root.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }

  return null;
};

export const findParent = (root: ModelItem, id: string): ModelItem | null => {
  for (const child of root.children) {
    if (child.id === id) return root;
    const found = findParent(child, id);
    if (found) return found;
  }
  return null;
};

export const updateNode = (
  root: ModelItem,
  id: string,
  updates: Partial<ModelItem>,
): ModelItem => {
  if (root.id === id) {
    const merged = { ...root, ...updates } as ModelItem;

    if ("dimensions" in root && "dimensions" in updates && updates.dimensions) {
      (merged as any).dimensions = {
        ...root.dimensions,
        ...updates.dimensions,
      };
    }

    return merged;
  }

  return {
    ...root,
    children: root.children.map((child) => updateNode(child, id, updates)),
  };
};

export const deleteNode = (root: ModelItem, id: string): ModelItem | null => {
  if (root.id === id) {
    return null;
  }

  const newChildren = root.children
    .map((child) => deleteNode(child, id))
    .filter((child): child is ModelItem => child !== null);

  return {
    ...root,
    children: newChildren,
  };
};

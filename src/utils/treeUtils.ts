import type { ModelItem } from "../types/modelTypes";
import type { FlattenedItem } from "../types/treeTypes";

function flatten(
  item: ModelItem,
  parentId: string | null = null,
  depth = 0
): FlattenedItem[] {
  const result: FlattenedItem[] = [
    { id: item.id, node: item, parentId, depth },
  ];

  // Recursively flatten the children
  for (const child of item.children) {
    result.push(...flatten(child, item.id, depth + 1));
  }

  return result;
}

export function flattenTree(items: ModelItem): FlattenedItem[] {
  return flatten(items);
}

export function removeChildrenOf(items: FlattenedItem[], ids: string[]) {
  const excludeIds = new Set(ids);
  return items.filter((item) => {
    if (item.parentId && excludeIds.has(item.parentId)) {
      if (item.node.children.length > 0) {
        excludeIds.add(item.id);
      }
      return false;
    }
    return true;
  });
}

export function getProjection(
  items: FlattenedItem[],
  activeId: string,
  overId: string,
  dragOffset: number,
  indentationWidth: number
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = [...items];

  newItems.splice(activeItemIndex, 1);
  newItems.splice(overItemIndex, 0, activeItem);

  const previousItem = newItems[overItemIndex - 1];

  let depth: number;
  let minDepth = 0;
  let maxDepth = 0;

  if (previousItem) {
    if (previousItem.node.type === "group") {
      maxDepth = previousItem.depth + 1;
    } else {
      maxDepth = previousItem.depth;
    }

    minDepth = previousItem.depth;
  }

  const dragDepth = Math.round(dragOffset / indentationWidth);
  depth = Math.max(minDepth, Math.min(maxDepth, activeItem.depth + dragDepth));

  let parentId: string | null = "root";

  if (depth === 0) {
    parentId = "root";
  } else {
    // Search backwards to find the parent
    for (let i = overItemIndex - 1; i >= 0; i--) {
      const item = newItems[i];

      // Parent must be a group and at the correct depth
      if (item.depth === depth - 1 && item.node.type === "group") {
        parentId = item.id;
        break;
      }
    }

    if (!parentId && previousItem) {
      depth = previousItem.depth;
      parentId = previousItem.parentId;
    }
  }

  return { depth, parentId };
}

export function buildTree(items: FlattenedItem[]): ModelItem[] {
  const root: ModelItem[] = [];
  const map = new Map<string, ModelItem>();

  items.forEach(({ id, node }) => {
    map.set(id, { ...node, children: [] });
  });

  items.forEach(({ id, parentId }) => {
    const item = map.get(id)!;
    if (parentId === null) {
      root.push(item);
    } else {
      const parent = map.get(parentId);
      if (parent) parent.children.push(item);
    }
  });

  return root;
}

import { useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useModel } from "../../../context/ModelContext";
import { type FlattenedItem } from "../../../types/treeTypes";
import {
  buildTree,
  flattenTree,
  getProjection,
  removeChildrenOf,
} from "../../../utils/treeUtils";
import TreeItem from "./TreeItem";

/**
 * Tree Component Logic
 *
 * How it works:
 * 1. Tree is flattened into a linear array for rendering (via flattenTree)
 * 2. Collapsed items have their children filtered out (removeChildrenOf)
 * 3. While the drag is happening, we calculate projection based on the horizontal offset
 * 4. When drag ends, we rebuild the tree that has been reordered
 * 5. Model from context is updated
 *
 */
export default function Tree() {
  const { model, setModel, toggleItem, setSelected } = useModel();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const indentationWidth = 13;
  const sensors = useSensors(useSensor(PointerSensor));

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(model);

    // Returns ids of collapsed groups:
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { node, id }) =>
        !node.expanded && node.children.length ? [...acc, id] : acc,
      [],
    );

    // Collapsed groups should render no children:
    const filtered = removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    );

    return filtered.filter((item) => item.depth > 0);
  }, [activeId, model]);

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null;

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems],
  );

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  return (
    <DndContext
      sensors={sensors}
      measuring={measuring}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <div className="mt-2 ml-[-7px] space-y-1 flex flex-col">
          {flattenedItems.map(({ id, node, depth }) => (
            <TreeItem
              key={id}
              id={id}
              node={node}
              value={node.name}
              depth={id === activeId && projected ? projected.depth : depth}
              indentationWidth={indentationWidth}
              collapsed={!node.expanded && node.children.length > 0}
              onCollapse={
                node.children.length > 0 ? () => toggleItem(id) : undefined
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(String(activeId));
    setOverId(String(activeId));
    setSelected(null);
    document.body.style.setProperty("cursor", "grabbing");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ? String(over.id) : null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(model)),
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      if (Array.isArray(newItems) && newItems.length > 0) {
        setModel(newItems[0]);
      }
    }
    setSelected(String(active.id));
  }

  function handleDragCancel() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
  }
}

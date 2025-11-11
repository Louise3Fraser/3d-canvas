import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { colors } from "../data/colors";
import { defaultDimensions } from "../data/defaults";
import { donut } from "../data/mock-data";
import {
  type ModelContentType,
  type ModelItem,
  type PrimitiveType,
} from "../types/modelTypes";
import {
  deleteNode,
  findNode,
  findParent,
  updateNode,
} from "../utils/modelUtiils";
import { findStackedPosition } from "../utils/placementUtils";

export const ModelContext = createContext<ModelContentType | undefined>(
  undefined
);

interface ModelProviderProps {
  children: ReactNode;
}

export function ModelProvider({ children }: ModelProviderProps) {
  const [model, setModel] = useState<ModelItem>(donut);
  const [selected, setSelected] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!selected) {
      setEdit(false);
      return;
    }
    const node = findNode(model, selected);
    setEdit(!!node); // converts any value to a boolean
    // if (selected) {
    //   const node = findNode(model, selected);
    //   if (node) {
    //     setEdit(true);
    //   } else {
    //     setEdit(false);
    //   }
    // } else {
    //   setEdit(false);
    // }
  }, [selected, model]);

  const addChild = (
    root: ModelItem,
    id: string,
    child: ModelItem
  ): ModelItem => {
    if (root.id === id) {
      return { ...root, children: [...root.children, child] };
    }
    return {
      ...root,
      children: root.children.map((n) => addChild(n, id, child)),
    };
  };

  const addPrimitive = (type: PrimitiveType, parentId = "root") => {
    const newItem: ModelItem = {
      id: uuidv4(),
      name: type,
      type: type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: `#${colors[Math.floor(Math.random() * colors.length)]}`,
      dimensions: defaultDimensions[type],
      children: [],
      expanded: true,
    };

    const smartPosition = findStackedPosition(newItem, model, 0, 0, 0.2);
    newItem.position = smartPosition;
    setModel((prev) => addChild(prev, parentId, newItem));
  };

  const addGroup = () => {
    const newGroup: ModelItem = {
      id: uuidv4(),
      name: "Group",
      type: "group",
      children: [],
      expanded: true,
    };
    setModel((prev) => addChild(prev, "root", newGroup));
  };

  const duplicate = (id: string) => {
    const node = findNode(model, id);
    if (!node) return;

    const newId = uuidv4();
    const newName = `${node.name} (copy)`;

    const deepClone = (item: ModelItem): ModelItem => ({
      ...item,
      id: uuidv4(),
      name: item.name.includes("(copy)") ? item.name : `${item.name} (copy)`,
      children: item.children.map(deepClone),
    });

    const cloned = deepClone(node);
    cloned.id = newId;
    cloned.name = newName;

    if (cloned.type !== "group" && cloned.position) {
      const smartPosition = findStackedPosition(
        cloned,
        model,
        cloned.position[0],
        cloned.position[1],
        0.2
      );
      cloned.position = smartPosition;
    }

    const parent = findParent(model, id);
    const parentId = parent ? parent.id : "root";

    setModel((prev) => addChild(prev, parentId, cloned));
    setSelected(newId);
    setEdit(true);
  };

  const deleteItem = (id: string) => {
    setModel((prev) => {
      const result = deleteNode(prev, id);
      return result ?? prev; // returns R side value ONLY IF the L side is null or undefined
    });
    setSelected(null);
    setEdit(false);
  };

  const deleteAll = () => {
    setModel({
      id: "root",
      name: "Root",
      type: "group",
      expanded: true,
      children: [],
    });
    setSelected(null);
    setEdit(false);
  };

  const updateItem = (id: string, updates: Partial<ModelItem>) => {
    setModel((prev) => updateNode(prev, id, updates));
  };

  const toggleExpand = (root: ModelItem, id: string): ModelItem => {
    if (root.id === id) {
      return { ...root, expanded: !root.expanded };
    }

    if (root.children && root.children.length > 0) {
      return {
        ...root,
        children: root.children.map((child) => toggleExpand(child, id)),
      };
    }
    return root;
  };

  const toggleItem = (id: string) => {
    setModel((prev) => toggleExpand(prev, id));
  };

  const exportModel = useCallback(() => {
    return JSON.parse(JSON.stringify(model));
  }, [model]);

  return (
    <ModelContext.Provider
      value={{
        model,
        setModel,
        selected,
        setSelected,
        addPrimitive,
        toggleItem,
        edit,
        setEdit,
        deleteItem,
        deleteAll,
        updateItem,
        addChild,
        exportModel,
        duplicate,
        addGroup,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("uh oh... useModel not in a ModelProvider");
  }
  return context;
};

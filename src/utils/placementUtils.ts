import { isPrimitive, type ModelItem } from "../types/modelTypes";

/* 
The following functions make sure that a new primitive does not 
overlap any existing ones.
*/

function getPrimitiveHeight(node: ModelItem): number {
  if (!isPrimitive(node)) return 0;

  switch (node.type) {
    case "box":
      return node.dimensions?.Height ?? 1;
    case "sphere":
      return (node.dimensions?.Radius ?? 0.5) * 2;
    case "cylinder":
    case "cone":
      return node.dimensions?.Height ?? 1;
    case "capsule":
      return (
        (node.dimensions?.Height ?? 1) + (node.dimensions?.Radius ?? 0.5) * 2
      );
    case "torus":
      return (node.dimensions?.TubeRadius ?? 0.4) * 2;
    default:
      return 1;
  }
}

function collectAllPrimitives(node: ModelItem): ModelItem[] {
  if (!isPrimitive(node)) {
    return node.children.flatMap(collectAllPrimitives);
  }
  return [node];
}

export function findStackedPosition(
  newNode: ModelItem,
  model: ModelItem,
  xPosition: number = 0,
  zPosition: number = 0,
  padding: number = 0.2,
): [number, number, number] {
  const existingPrimitives = collectAllPrimitives(model);

  if (existingPrimitives.length === 0) {
    const newHeight = getPrimitiveHeight(newNode);
    return [xPosition, newHeight / 2, zPosition];
  }

  let maxY = 0;

  existingPrimitives.forEach((prim) => {
    if (!isPrimitive(prim)) return;

    const primY = prim.position[1];
    const primHeight = getPrimitiveHeight(prim);
    const topY = primY + primHeight / 2;

    if (topY > maxY) {
      maxY = topY;
    }
  });

  const newHeight = getPrimitiveHeight(newNode);
  const newY = maxY + padding + newHeight / 2;

  return [xPosition, newY, zPosition];
}

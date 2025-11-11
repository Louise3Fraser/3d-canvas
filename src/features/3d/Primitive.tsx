import { useState } from "react";
import { Box, Capsule, Cone, Cylinder, Sphere, Torus } from "@react-three/drei";
import { Color } from "three";
import { useModel } from "../../context/ModelContext";
import { isPrimitive, type ModelItem } from "../../types/modelTypes";

interface PrimitiveProps {
  node: ModelItem;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
}

const primitiveMap = {
  box: Box,
  cylinder: Cylinder,
  cone: Cone,
  sphere: Sphere,
  torus: Torus,
  capsule: Capsule,
} as const;

export const Primitive3D = ({ node, isHovered, onClick }: PrimitiveProps) => {
  const [hovered, setHovered] = useState(false);
  const { setEdit, setSelected } = useModel();

  if (!isPrimitive(node)) {
    return null;
  }

  const Component = primitiveMap[node.type as keyof typeof primitiveMap];

  const args = (() => {
    switch (node.type) {
      case "box":
        return [
          node.dimensions?.Width ?? 1,
          node.dimensions?.Height ?? 1,
          node.dimensions?.Depth ?? 1,
        ];
      case "cone":
        return [
          node.dimensions?.Radius ?? 1,
          node.dimensions?.Height ?? 1,
          node.dimensions?.RadialSegments ?? 32,
        ];
      case "cylinder":
        return [
          node.dimensions?.RadiusTop ?? 0.5,
          node.dimensions?.RadiusBottom ?? 0.5,
          node.dimensions?.Height ?? 1,
        ];
      case "torus":
        return [
          node.dimensions?.Radius ?? 1,
          node.dimensions?.TubeRadius ?? 0.4,
          node.dimensions?.RadialSegments ?? 32,
          node.dimensions?.TubularSegments ?? 16,
          node.dimensions?.Arc ?? Math.PI * 2,
        ];
      case "capsule":
        return [
          node.dimensions?.Radius ?? 0.5,
          node.dimensions?.Height ?? 1,
          node.dimensions?.CapSegments ?? 8,
          node.dimensions?.RadialSegments ?? 16,
        ];
      case "sphere":
        return [node.dimensions?.Radius ?? 0.5, 32, 32];

      default:
        return [1, 1, 1];
    }
  })();

  // Darken color on hover (15% default)
  const getHoverColor = (baseColor: string, darkenAmount = 0.15) => {
    const color = new Color(baseColor);
    color.multiplyScalar(1 - darkenAmount);
    return `#${color.getHexString()}`;
  };

  return (
    <Component
      args={args as any}
      name={node.id}
      position={node.position ?? [0, 0, 0]}
      rotation={node.rotation ?? [0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        setEdit(true);
        setSelected(node.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={isHovered || hovered ? getHoverColor(node.color) : node.color}
      />
    </Component>
  );
};

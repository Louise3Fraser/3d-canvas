import { type JSX, useEffect, useRef, useState } from "react";
import {
  Grid,
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useModel } from "../../context/ModelContext";
import { useUI } from "../../context/UIContext";
import { type ModelItem } from "../../types/modelTypes";
import CameraController from "./CameraControls";
import { Primitive3D } from "./Primitive";

function renderItem(
  node: ModelItem,
  selectedId: string | null,
  hoveredId: string | null,
  onSelect: (id: string) => void,
  onHover: (id: string | null) => void
): JSX.Element {
  if (node.type === "group") {
    return (
      <group key={node.id}>
        {node.children.map((child) =>
          renderItem(child, selectedId, hoveredId, onSelect, onHover)
        )}
      </group>
    );
  }

  return (
    <Primitive3D
      key={node.id}
      node={node}
      isSelected={node.id === selectedId}
      isHovered={node.id === hoveredId}
      onClick={() => onSelect(node.id)}
    />
  );
}

const modes = ["translate", "rotate"] as const;

function Controls() {
  const { modeIndex } = useUI();
  const { selected, updateItem } = useModel();
  const { scene } = useThree();
  const orbitRef = useRef<any>(null);
  const transformRef = useRef<any>(null);

  const mode = modes[modeIndex];

  const target = selected ? scene.getObjectByName(selected) : null;

  useEffect(() => {
    if (!transformRef.current) return;
    const control = transformRef.current;

    control.setMode(mode);

    const onDragging = (e: { value: boolean }) => {
      if (orbitRef.current) orbitRef.current.enabled = !e.value;
    };
    control.addEventListener("dragging-changed", onDragging);
    return () => control.removeEventListener("dragging-changed", onDragging);
  }, [mode]);

  useEffect(() => {
    if (!target || !transformRef.current) return;

    const onChange = () => {
      if (!target) return;
      if (mode === "translate") {
        updateItem(selected!, {
          position: [target.position.x, target.position.y, target.position.z],
        });
      } else if (mode === "rotate") {
        updateItem(selected!, {
          rotation: [target.rotation.x, target.rotation.y, target.rotation.z],
        });
      }
    };

    const ctrl = transformRef.current;
    ctrl.addEventListener("objectChange", onChange);
    return () => ctrl.removeEventListener("objectChange", onChange);
  }, [target, mode, selected, updateItem]);

  if (!target) return <OrbitControls ref={orbitRef} makeDefault enablePan />;

  return (
    <>
      <TransformControls ref={transformRef} object={target} mode={mode} />
      <OrbitControls ref={orbitRef} makeDefault enablePan />
    </>
  );
}

export default function Scene() {
  const { showGrid } = useUI();
  const { model, selected, setSelected, setEdit } = useModel();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const orbitRef = useRef<any>(null);

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={[8, 6, 5]} fov={55} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      {showGrid ? (
        <Grid
          args={[40, 40]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#4E4B45"
          sectionSize={5}
          sectionThickness={0.8}
          sectionColor="#4E4B45"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />
      ) : (
        <></>
      )}
      <group
        onPointerMissed={() => {
          setSelected(null);
          setHoveredId(null);
          setEdit(false);
        }}
      >
        {renderItem(
          model,
          selected,
          hoveredId,
          (id) => {
            setSelected(id);
            setEdit(true);
            setHoveredId(null);
          },
          setHoveredId
        )}
      </group>
      <CameraController orbitControlsRef={orbitRef} />
      <Controls />
    </Canvas>
  );
}

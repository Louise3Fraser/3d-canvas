import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

interface CameraControllerProps {
  orbitControlsRef?: React.RefObject<any>;
}

export default function CameraController({
  orbitControlsRef,
}: CameraControllerProps) {
  const { camera } = useThree();

  useEffect(() => {
    const handleRecenter = () => {
      camera.position.set(8, 6, 5);

      if (orbitControlsRef?.current) {
        orbitControlsRef.current.target.set(0, 0, 0);
        orbitControlsRef.current.update();
      }
    };

    window.addEventListener("recenter-camera", handleRecenter);
    return () => window.removeEventListener("recenter-camera", handleRecenter);
  }, [camera, orbitControlsRef]);

  return null;
}

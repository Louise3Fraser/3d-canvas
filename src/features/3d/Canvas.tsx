import Toolbar from "../floating/Toolbar";
import Scene from "./Scene";

export default function Canvas() {
  return (
    <div className="flex-1 overflow-auto h-[calc(100vh-31px)] overscroll-contain">
      <div className="bg-white h-full">
        <Toolbar />
        <Scene />
      </div>
    </div>
  );
}

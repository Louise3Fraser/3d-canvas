import ghLogo from "../../assets/gh-logo.png";
import logo from "../../assets/logo.png";
import Button from "../../components/buttons/Button";
import ColorButton from "../../components/buttons/ColorButton";
import { useModel } from "../../context/ModelContext";
import { useUI } from "../../context/UIContext";

const COLORS = ["gradient-1", "gradient-2", "gradient-3"];

export default function Header() {
  const { theme, setTheme } = useUI();
  const { exportModel } = useModel();

  // Export a json doc of the current model hierarchy:
  const handleExport = () => {
    const model = exportModel();
    const dataStr = JSON.stringify(model, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${model.name || "model"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex flex-row justify-between px-4 py-2 border-b border-border">
      <div className="flex flex-row items-center gap-2">
        <img src={logo} alt="canvas3d-logo" className="h-4 max-w-full" />
        <h1>Canvas3D</h1>
      </div>
      <div className="flex flex-row items-center gap-5">
        <div className="flex flex-row items-center gap-2">
          {COLORS.map((color, i) => (
            <div key={i}>
              <ColorButton
                key={color}
                name={color}
                isActive={theme === color}
                onClick={() => setTheme(color as any)}
              />
            </div>
          ))}
        </div>
        <a href="https://github.com/Louise3Fraser/canvas-3d" target="_blank">
          <img src={ghLogo} className="w-6 h-6" alt="Github logo" />
        </a>
        <Button content="Export" onClick={handleExport} />
      </div>
    </header>
  );
}

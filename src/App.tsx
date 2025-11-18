import { useEffect } from "react";
import { ModelProvider, useModel } from "./context/ModelContext";
import { UIProvider, useUI } from "./context/UIContext";
import Canvas from "./features/3d/Canvas";
import Header from "./features/layout/Header";
import Sidebar from "./features/layout/LeftSidebar";
import RightSidebar from "./features/layout/RightSidebar";

function AppContent() {
  const { theme } = useUI();
  const { undo, redo, canUndo, canRedo } = useModel();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          undo();
        }
      }
      // Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z for redo
      else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        if (canRedo) {
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo]);
  return (
    <div
      className={`h-screen flex flex-col ${theme} overscroll-contain overflow-auto`}
    >
      <Header />
      <div className="flex-1 grid grid-cols-[240px_1fr_280px] overscroll-contain overflow-hidden">
        <Sidebar />
        <Canvas />
        <RightSidebar />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ModelProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </ModelProvider>
  );
}

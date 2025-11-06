import { ModelProvider } from "./context/ModelContext";
import { UIProvider, useUI } from "./context/UIContext";
import Canvas from "./features/3d/Canvas";
import Header from "./features/layout/Header";
import Sidebar from "./features/layout/LeftSidebar";
import RightSidebar from "./features/layout/RightSidebar";

function AppContent() {
  const { theme } = useUI();
  return (
    <div
      className={`h-screen flex flex-col ${theme} overscroll-contain overflow-auto`}
    >
      <Header />
      <div className="flex-1 grid grid-cols-[240px_1fr_300px] overscroll-contain overflow-hidden">
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

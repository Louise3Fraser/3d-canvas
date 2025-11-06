import Tree from "./tree/Tree";

export default function LeftSidebar() {
  return (
    <div className="h-full px-5 py-0 pb-5 overflow-scroll border-r border-border">
      <h2 className="mt-3">Model Hierarchy</h2>
      <Tree />
    </div>
  );
}

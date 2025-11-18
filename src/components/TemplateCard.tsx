import { useModel } from "../context/ModelContext";
import type { ModelItem } from "../types/modelTypes";

interface TemplateProps {
  src: string;
  title: string;
  model: ModelItem;
}

export default function TemplateCard({ src, title, model }: TemplateProps) {
  const { setModel, setSelected } = useModel();

  return (
    <button
      onClick={() => {
        setSelected(null);
        setModel(model);
      }}
      className="h-full w-full rounded-lg overflow-clip cursor-pointer border hover:opacity-90"
    >
      <img src={src} alt={title} className="w-full h-58.5 object-cover" />
    </button>
  );
}

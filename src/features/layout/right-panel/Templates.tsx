import TemplateCard from "../../../components/TemplateCard";
import { templates } from "../../../data/templates";

export default function Templates() {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template, i) => (
          <TemplateCard
            key={i}
            src={template.src}
            title={template.title}
            model={template.data}
          />
        ))}
      </div>
    </div>
  );
}

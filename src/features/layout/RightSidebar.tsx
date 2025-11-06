import { useEffect, useState } from "react";
import Tabs from "../../components/buttons/Tabs";
import { useModel } from "../../context/ModelContext";
import Edit from "./right-panel/Edit";
import Templates from "./right-panel/Templates";

export default function RightSidebar() {
  const [section, setSection] = useState<string>("templates");
  const { edit } = useModel();

  useEffect(() => {
    if (edit) {
      setSection("edit");
    }
  }, [edit]);

  return (
    <div className="h-full px-5 py-1 pb-5 overflow-scroll border-l border-border">
      <div className="flex flex-row gap-6 mb-3.5 mt-2">
        <Tabs
          value={section}
          onChange={setSection}
          values={[
            { name: "Templates", value: "templates" },
            { name: "Properties", value: "edit" },
          ]}
        />
      </div>
      {section === "templates" ? <Templates /> : <Edit />}
    </div>
  );
}

import { Tab, TabGroup, TabList } from "@headlessui/react";
import { motion } from "framer-motion";

type TabsProps = {
  values: { name: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
};

export default function Tabs({ values, value, onChange }: TabsProps) {
  const selectedIndex = values.findIndex((v) => v.value === value);

  return (
    <TabGroup
      className="w-full h-9.5 flex flex-row justify-center"
      selectedIndex={selectedIndex}
      onChange={(i) => onChange(values[i]?.value ?? values[0].value)}
    >
      <TabList className="flex items-center w-full justify-center rounded-lg bg-light p-1 relative">
        {values.map((tab, i) => (
          <Tab
            key={i}
            className="w-full outline-none cursor-pointer relative z-10"
          >
            {({ selected }) => (
              <>
                {selected && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-md shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <h4
                  className={[
                    "relative z-10 block rounded-md px-5 py-1.5 transition-colors",
                    selected
                      ? "text-main"
                      : "text-grey-400 hover:text-grey-500",
                  ].join(" ")}
                >
                  {tab.name}
                </h4>
              </>
            )}
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  );
}

import { type ReactNode } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import type { PrimitiveType } from "../types/modelTypes";

interface DropdownProps {
  options: { value: PrimitiveType; label: string; icon?: ReactNode }[];
  value: PrimitiveType | "";
  onChange: (value: PrimitiveType) => void;
  mainIcon: ReactNode;
}

export default function Dropdown({
  options,
  onChange,
  mainIcon,
}: DropdownProps) {
  return (
    <Menu as="div" className="relative flex">
      <MenuButton className="inline-flex w-full justify-between items-center gap-1 text-sm font-medium text-grey cursor-pointer rounded-sm focus:outline-none">
        <span className="flex items-center gap-1">{mainIcon}</span>
      </MenuButton>

      <MenuItems className="absolute w-30 left-0 top-5 z-10 mt-2 p-2.5 rounded-sm bg-background-primary shadow-sm border focus:outline-none">
        {options.map((option) => (
          <MenuItem key={option.value}>
            <button
              className="flex w-full rounded-sm flex-row gap-2 items-center h-6.5 text-main hover:bg-grey-lighter cursor-pointer"
              onClick={() => onChange(option.value)}
            >
              {option.icon}
              <p>
                {option.label.charAt(0).toUpperCase()}
                {option.label.slice(1)}
              </p>
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}

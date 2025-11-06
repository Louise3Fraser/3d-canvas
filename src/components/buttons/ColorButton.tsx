interface Props {
  name: string;
  isActive?: boolean;
  onClick: () => void;
}

export default function ColorButton({ name, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        w-5.5 h-5.5 shadow-sm overflow-clip rounded-full transition-all duration-200 cursor-pointer border m-[1.75px] items-center flex
        ${isActive ? "border-blue-500" : ""}
        ${name}
      `}
    />
  );
}

interface ButtonProps {
  content: string;
  onClick: () => void;
}

export default function Button({ content, onClick }: ButtonProps) {
  return (
    <div className="flex items-center border rounded-lg">
      <button
        onClick={onClick}
        className="bg-main hover:opacity-95 py-[5.5px] px-3.5 m-0.5 text-[#ffffff] font-weight-normal rounded-md text-xs cursor-pointer shadow-sm"
      >
        {content}
      </button>
    </div>
  );
}

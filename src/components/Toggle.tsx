import { motion } from "framer-motion";

interface ToggleProps {
  isLeft: boolean;
  onClick: () => void;
}

export default function Toggle({ isLeft, onClick }: ToggleProps) {
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={onClick}
        className="relative w-15 h-5.5 rounded-full shadow-sm bg-tan cursor-pointer overflow-hidden"
      >
        <motion.div
          className="absolute top-0 bottom-0 w-1/2 rounded-full bg-blue-100 border-1.5 border-blue-400"
          animate={{
            left: isLeft ? 0 : "50%",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />

        <div className="relative h-full flex items-center justify-between px-3">
          <span
            className={`transition-colors duration-300 text-xs ${
              isLeft ? "text-blue-400" : "text-grey"
            }`}
          >
            T
          </span>
          <span
            className={`transition-colors duration-300 text-xs ${
              !isLeft ? "text-blue-400" : "text-grey"
            }`}
          >
            R
          </span>
        </div>
      </button>
    </div>
  );
}

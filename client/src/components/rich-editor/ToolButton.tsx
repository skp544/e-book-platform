import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  isActive?: boolean;
  children?: ReactNode;
  onClick?(): void;
}

const ToolButton = ({ children, isActive, onClick }: Props) => {
  return (
    <button
      type={"button"}
      className={clsx("p-1 rounded", isActive && "bg-black text-white")}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ToolButton;

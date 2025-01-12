import { Button } from "@nextui-org/react";
import { ReactNode } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import clsx from "clsx";

interface Props {
  side: "left" | "right";
  onClick(): void;
  className?: string;
}

const Navigator = ({ side, onClick, className }: Props) => {
  let icon: ReactNode = <></>;
  let classesBySide = "";

  if (side === "left") {
    icon = <FaAngleLeft />;
    classesBySide = "left-0 pl-5 transition";
  }

  if (side === "right") {
    icon = <FaAngleRight />;
    classesBySide = "right-0 pr-5 transition";
  }

  return (
    <div className={clsx("fixed top-1/2", classesBySide, className)}>
      <Button
        className={""}
        radius={"full"}
        variant={"bordered"}
        isIconOnly
        onPress={onClick}
      >
        {icon}
      </Button>
    </div>
  );
};

export default Navigator;

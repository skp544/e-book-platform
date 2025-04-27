import { Button } from "@heroui/react";
import clsx from "clsx";
import { FC } from "react";
import { MdOutlineClear } from "react-icons/md";

interface Props {
  visible?: boolean;
  onClear(): void;
  onSelect(color: string): void;
}

const colorOptions = ["red", "blue", "yellow"];

const HighlightOptions: FC<Props> = ({ visible, onSelect, onClear }) => {
  return (
    <div
      className={clsx(
        visible ? "bottom-0" : "-bottom-14",
        "dark:bg-book-dark fixed left-0 right-0 z-50 flex h-14 items-center justify-center space-x-3 bg-gray-100 transition-all",
      )}
    >
      {colorOptions.map((color) => {
        return (
          <button
            onClick={() => onSelect(color)}
            key={color}
            style={{ backgroundColor: color }}
            className="h-6 w-6 rounded-full"
          ></button>
        );
      })}

      <Button onPress={onClear} isIconOnly variant="light">
        <MdOutlineClear size={24} />
      </Button>
    </div>
  );
};

export default HighlightOptions;

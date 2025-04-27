import { Spinner } from "@heroui/react";
import clsx from "clsx";

interface Props {
  visible: boolean;
}

const LoadingIndicator = ({ visible }: Props) => {
  return (
    <div
      className={clsx(
        visible ? "block" : "hidden",
        "fixed inset-0 z-[100] flex items-center justify-center bg-white",
      )}
    >
      <Spinner color={"success"} />
    </div>
  );
};

export default LoadingIndicator;

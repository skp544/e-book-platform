import { Spinner } from "@nextui-org/react";
import clsx from "clsx";

interface Props {
  visible: boolean;
}

const LoadingIndicator = ({ visible }: Props) => {
  return (
    <div
      className={clsx(
        visible ? "block" : "hidden",
        "fixed z-[100] inset-0 bg-white flex items-center justify-center",
      )}
    >
      <Spinner color={"success"} />
    </div>
  );
};

export default LoadingIndicator;

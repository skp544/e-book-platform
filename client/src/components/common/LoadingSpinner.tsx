import { Spinner } from "@heroui/react";

interface Props {
  verify?: boolean;
}

const LoadingSpinner = ({ verify }: Props) => {
  return (
    <div className={"flex items-center justify-center p-10"}>
      <Spinner color="warning" label={verify ? "Verifying..." : ""} />;
    </div>
  );
};

export default LoadingSpinner;

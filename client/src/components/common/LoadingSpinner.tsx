import { Spinner } from "@nextui-org/react";

const LoadingSpinner = () => {
  return (
    <div className={"flex items-center justify-center p-10"}>
      <Spinner color="warning" label="Verifying..." />;
    </div>
  );
};

export default LoadingSpinner;

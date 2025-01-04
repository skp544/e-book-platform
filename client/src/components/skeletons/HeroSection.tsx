import { Skeleton } from "@nextui-org/react";

const HeroSection = () => {
  return (
    <div className="md:h-96 overflow-hidden rounded-md  bg-default-100  animate-pulse bg-gradient-to-r from-transparent">
      <Skeleton className="w-full h-full" />
    </div>
  );
};

export default HeroSection;

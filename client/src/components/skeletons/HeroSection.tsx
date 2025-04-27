import { Skeleton } from "@heroui/react";

const HeroSection = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-md bg-default-100 bg-gradient-to-r from-transparent md:h-96">
      <Skeleton className="h-full w-full" />
    </div>
  );
};

export default HeroSection;

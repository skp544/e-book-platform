import { Divider, Skeleton } from "@heroui/react";

const BookDetails = () => {
  return (
    <div className="md:flex">
      <div className="">
        <div className="">
          <Skeleton className="h-80 w-48 rounded-md object-cover" />
        </div>
      </div>

      <div className="flex-1 pt-6 md:pl-10 md:pt-0">
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        <div className="mt-3 flex items-center space-x-1 font-semibold">
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 rounded" />
          <Skeleton className="h-4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>

        <div className="mt-6 flex h-10 items-center space-x-6">
          <Skeleton className="h-8 w-8 rounded" />

          <Divider orientation="vertical" className="h-1/2" />

          <Skeleton className="h-8 w-8 rounded" />

          <Divider orientation="vertical" className="h-1/2" />

          <Skeleton className="h-8 w-8 rounded" />

          <Divider orientation="vertical" className="h-1/2" />

          <Skeleton className="h-8 w-8 rounded" />
        </div>

        <div className="mt-6 flex items-center space-x-3">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

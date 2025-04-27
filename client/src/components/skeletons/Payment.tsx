import { Divider, Skeleton } from "@heroui/react";

const Payment = () => {
  return (
    <div className="p-5 lg:p-0">
      <Skeleton className="h-4 w-1/4 rounded" />

      <div className="flex flex-col items-center p-5">
        <div className="w-96">
          <div className="flex">
            <Skeleton className="h-40 w-28 rounded object-cover" />

            <div className="flex-1 space-y-2 p-3">
              <Skeleton className="h-4 w-1/2 rounded" />

              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
          <Divider className="my-3" />

          <div className="flex">
            <Skeleton className="h-40 w-28 rounded object-cover" />

            <div className="flex-1 space-y-2 p-3">
              <Skeleton className="h-4 w-1/2 rounded" />

              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
          <Divider className="my-3" />

          <div className="flex w-96 items-center justify-between">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

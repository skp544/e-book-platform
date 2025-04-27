import { Divider, Skeleton } from "@heroui/react";
import { FC, JSX } from "react";

export interface Props {
  items?: number;
}

const Orders: FC<Props> = ({ items = 3 }): JSX.Element => {
  const fakeData = new Array(items).fill("");

  return (
    <div className="p-5 lg:p-0">
      {fakeData?.map((_, index) => {
        return (
          <div key={index}>
            <Skeleton className="h-6 w-1/4 rounded-t" />
            <Divider />

            <div className="flex p-5">
              <Skeleton className="h-32 w-24 rounded" />

              <div className="space-y-4 px-5">
                <Skeleton className="h-4 w-56 rounded" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
            <div className="flex justify-end">
              <Divider className="w-10/12" />
            </div>

            <div className="flex justify-end space-x-2 py-6">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;

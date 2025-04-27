import { Skeleton } from "@heroui/react";
import { FC, JSX } from "react";

export interface Props {
  itemsCount?: number;
}

const Cart: FC<Props> = ({ itemsCount = 2 }): JSX.Element => {
  const dummyItems = Array(itemsCount).fill("");

  return (
    <div className="p-5 lg:p-0">
      <Skeleton className="mb-6 h-4 w-1/4 rounded" />

      <div className="space-y-6">
        {dummyItems.map((_, index) => {
          return (
            <div key={index} className="flex">
              {/* Product Image */}
              <div>
                <Skeleton className="h-[185px] w-28 rounded" />
              </div>

              <div className="flex grid-cols-6 flex-col overflow-hidden md:grid">
                {/* Product Details */}
                <div className="col-span-5 space-y-3 p-5">
                  <Skeleton className="h-2 w-1/4 rounded" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20 rounded" />
                    <Skeleton className="h-8 w-20 rounded" />
                  </div>

                  <div className="flex items-center space-x-2 text-xl md:text-2xl">
                    <Skeleton className="h-8 w-20 rounded" />
                  </div>
                </div>

                {/* Cart Control */}
                <div className="col-span-1 flex items-center space-x-3 p-5 md:justify-end md:p-0">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-20 rounded" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cart;

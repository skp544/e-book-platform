import { useEffect, useState } from "react";
import { IOrders } from "../types";
import { getOrdersApi } from "../apis/order.ts";
import { addToast, Chip, Divider } from "@heroui/react";
import Skeletons from "../components/skeletons";
import { formatPrice } from "../helpers";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import DividerWithTitle from "../components/common/DividerWithTitle.tsx";
import dateFormat from "dateformat";

const Orders = () => {
  const [busy, setBusy] = useState(true);
  const [orders, setOrders] = useState<IOrders[]>();

  const fetchOrders = async () => {
    const response = await getOrdersApi();
    setBusy(false);
    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    setOrders(response.data);
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  if (busy) {
    return <Skeletons.Orders />;
  }

  if (!orders?.length)
    return (
      <div className="p-5 lg:p-0">
        <h1 className="mb-6 text-xl font-semibold">Your Orders</h1>
        <div className="pt-10 text-center text-3xl font-bold opacity-60">
          <p>{"Your don't have any orders!"}</p>
        </div>
      </div>
    );

  return (
    <div className={"p-5 lg:p-0"}>
      <h1 className="mb-6 text-xl font-semibold">Your Orders</h1>

      {orders?.map((order) => (
        <div key={order.id}>
          <DividerWithTitle title={dateFormat(order.date, "mmmm d yyyy")} />
          {order.orderItem.map((item) => (
            <div key={item.id}>
              <div className="flex p-5">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-24 rounded"
                />

                <div className={"px-5"}>
                  <Link
                    to={`/book/${item.slug}`}
                    className="text-lg font-bold underline"
                  >
                    {item.title}
                  </Link>

                  <div className="flex items-center space-x-0.5">
                    <p className="font-semibold">
                      {formatPrice(Number(item.price))}
                    </p>
                    <IoCloseOutline />
                    <p>{item.qty} pcs</p>
                  </div>

                  <Chip color="danger" radius="sm" className="mt-2">
                    {formatPrice(Number(item.totalPrice))}
                  </Chip>
                </div>
              </div>

              <div className="flex justify-end">
                <Divider className="w-10/12" />
              </div>
            </div>
          ))}

          <div className={"space-y-1 py-6 text-right"}>
            <p className="text-xl font-semibold">
              Total Amount: {formatPrice(Number(order.totalAmount))}
            </p>
            <p>Payment Status: {order.paymentStatus?.toUpperCase()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Orders;

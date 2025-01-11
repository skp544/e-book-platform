import { useEffect, useState } from "react";
import { getOrdersApi } from "../apis/order.ts";
import toast from "react-hot-toast";
import dateFormat from "dateformat";
import Skeletons from "../components/skeletons";
import { IOrders } from "../types";
import DividerWithTitle from "../components/common/DividerWithTitle.tsx";
import { Link } from "react-router-dom";
import { formatPrice } from "../helper";
import { IoCloseOutline } from "react-icons/io5";
import { Chip, Divider } from "@nextui-org/react";

const Orders = () => {
  const [busy, setBusy] = useState(true);
  const [orders, setOrders] = useState<IOrders[]>();

  const fetchOrders = async () => {
    const response = await getOrdersApi();
    setBusy(false);
    if (!response.success) {
      return toast.error(response.message);
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
        <h1 className="text-xl font-semibold mb-6">Your Orders</h1>
        <div className="text-center pt-10 font-bold text-3xl opacity-60">
          <p>{"Your don't have any orders!"}</p>
        </div>
      </div>
    );

  return (
    <div className={"p-5 lg:p-0"}>
      <h1 className="text-xl font-semibold mb-6">Your Orders</h1>

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

          <div className={"text-right space-y-1 py-6"}>
            <p className="font-semibold text-xl">
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

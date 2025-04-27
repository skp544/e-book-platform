import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Order } from "../types";
import { orderSuccessApi } from "../apis/order.ts";
import { addToast, Divider } from "@heroui/react";
import Skeletons from "../components/skeletons";
import { formatPrice } from "../helpers";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [busy, setBusy] = useState(true);
  const [order, setOrder] = useState<Order>();

  const fetchOrderDetails = async () => {
    if (!sessionId) {
      return;
    }
    const response = await orderSuccessApi({ sessionId });
    setBusy(false);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    setOrder(response.data);
  };

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    fetchOrderDetails();
  }, [sessionId]);

  if (busy) {
    return <Skeletons.Payment />;
  }

  return (
    <div className={"p-5 lg:p-0"}>
      <h1 className={"text-2xl font-semibold"}>
        Congrats Your Order is Successful.
      </h1>
      <div className={"flex flex-col items-center p-5"}>
        {order?.orders.map((item) => (
          <div key={item.id} className={"w-96"}>
            <div className={"flex"}>
              <img
                src={item.cover}
                alt={item.title}
                className={"h-40 w-28 rounded"}
              />

              <div className={"flex-1 p-3"}>
                <Link
                  className={"line-clamp-1 text-lg font-bold underline"}
                  to={`/book/${item.slug}`}
                >
                  {item.title}
                </Link>
                <p>{formatPrice(item.price)}</p>
                <p>Oty: {item.qty}</p>
              </div>
            </div>

            <Divider className={"my-3"} />
          </div>
        ))}

        <div className={"flex w-96 items-center justify-between"}>
          <p className={"font-bold"}>Total Amount: </p>
          <p className={"font-bold"}>{formatPrice(order?.totalAmount)}</p>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;

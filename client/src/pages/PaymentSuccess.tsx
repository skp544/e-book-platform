import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { orderSuccessApi } from "../apis/order.ts";
import toast from "react-hot-toast";
import { Order } from "../types";
import { formatPrice } from "../helper";
import { Divider } from "@nextui-org/react";
import Skeletons from "../components/skeletons";

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
      return toast.error(response.message);
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
    <div className={"lg:p-0 p-5"}>
      <h1 className={"font-semibold text-2xl"}>
        Congrats Your Order is Successful.
      </h1>
      <div className={"p-5 flex flex-col items-center"}>
        {order?.orders.map((item) => (
          <div key={item.id} className={" w-96 "}>
            <div className={"flex"}>
              <img
                src={item.cover}
                alt={item.title}
                className={"w-28 h-40 rounded"}
              />

              <div className={"p-3 flex-1"}>
                <Link
                  className={"line-clamp-1 font-bold text-lg underline"}
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

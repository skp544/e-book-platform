import useCart from "../hooks/useCart.ts";
import { useState } from "react";
import { checkoutApi } from "../apis/checkout.ts";
import { addToast, Button, Chip, Divider } from "@heroui/react";
import Skeletons from "../components/skeletons";
import { calculateDiscount, formatPrice } from "../helpers";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaMinus, FaPlus } from "react-icons/fa";

const Cart = () => {
  const [busy, setBusy] = useState(false);
  const {
    items,
    pending,
    updateCart,
    totalCount,
    fetching,
    subTotal,
    totalPrice,
    clearCart,
    id,
  } = useCart();

  const handleCheckout = async () => {
    if (!id) return;

    setBusy(true);
    const response = await checkoutApi({ cartId: id! });
    setBusy(false);

    if (!response.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    if (response.checkoutUrl) {
      window.location.href = response.checkoutUrl;
    }
  };

  if (fetching) {
    return <Skeletons.Cart />;
  }

  if (!totalCount)
    return (
      <div className="p-5 lg:p-0">
        <h1 className="mb-6 text-xl font-semibold">Your Shopping Cart</h1>
        <div className="p-5 text-center">
          <h1 className="text-3xl font-semibold opacity-40">
            This Cart is Empty!
          </h1>
        </div>
      </div>
    );

  return (
    <div className="p-5 lg:p-0">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-xl font-semibold">Your Shopping Cart</h1>
        <button className="underline" onClick={clearCart} type="button">
          Clear Cart
        </button>
      </div>
      <div className="space-y-6">
        {items.map(({ product, quantity }) => {
          return (
            <div key={product.id} className="flex">
              <img
                src={product.cover}
                alt={product.title}
                className="h-[185px] w-28 rounded object-cover"
              />

              <div className="flex grid-cols-6 flex-col md:grid">
                <div className="col-span-5 p-5">
                  <h1>{product.title}</h1>
                  <div className="flex space-x-2">
                    <Chip color="danger">
                      {calculateDiscount(product.price)}% Off
                    </Chip>
                    <h1 className="italic line-through">
                      {formatPrice(product.price.mrp)}
                    </h1>
                  </div>
                  <div className="flex space-x-2">
                    <h1 className="italic line-through">
                      {formatPrice(product.price.sale)}
                    </h1>

                    <span>x {quantity}</span>
                  </div>
                </div>

                {/* Cart Control */}
                <div className="col-span-1 flex items-center space-x-3 p-5 md:p-0">
                  <Button
                    isIconOnly
                    onPress={() => updateCart({ product, quantity: -1 })}
                    variant="solid"
                    size="sm"
                    isLoading={pending || busy}
                  >
                    <FaMinus />
                  </Button>
                  <Chip radius="sm" variant="bordered">
                    {quantity}
                  </Chip>
                  <Button
                    onPress={() => updateCart({ product, quantity: 1 })}
                    isIconOnly
                    variant="solid"
                    size="sm"
                    isLoading={pending || busy}
                  >
                    <FaPlus />
                  </Button>
                  <Button
                    isIconOnly
                    onPress={() => updateCart({ product, quantity: -quantity })}
                    variant="solid"
                    size="sm"
                    isLoading={pending || busy}
                  >
                    <FaRegTrashCan />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Divider className="my-6" />
      <div className="flex items-end justify-between md:block">
        <div className="text-right">
          <h1 className="text-xl font-semibold">Cart Total</h1>
          <Divider />
          <p className="line-through">{formatPrice(subTotal)}</p>
          <p className="text-xl font-semibold">{formatPrice(totalPrice)}</p>
        </div>

        <div className="text-right md:mt-3">
          <Button
            color="danger"
            radius="sm"
            size="lg"
            isLoading={pending || busy}
            type="button"
            startContent={<MdOutlineShoppingCartCheckout size={18} />}
            onPress={handleCheckout}
          >
            Checkout
          </Button>
          <div className="mt-3">
            <Chip size="sm">
              <p>
                You are saving total{" "}
                <span>
                  {calculateDiscount({ mrp: subTotal, sale: totalPrice })}
                </span>
                %
              </p>
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;

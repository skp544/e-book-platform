import useCart from "../hooks/useCart";
import Skeletons from "../components/skeletons";
import { Button, Chip, Divider } from "@nextui-org/react";
import { calculateDiscount, formatPrice } from "../helper";
import { FaMinus, FaPlus, FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";

const Cart = () => {
  const { items, updateCart, fetching, subTotal, totalPrice } = useCart();

  if (fetching) {
    return <Skeletons.Cart />;
  }

  return (
    <div className="lg:p-0 p-5">
      <h1 className="text-xl mb-6 font-semibold">
        <div className="space-y-6">
          {items.map(({ product, quantity }) => {
            return (
              <div key={product.id} className="flex">
                <img
                  src={product.cover}
                  alt={product.title}
                  className="w-28 h-[185px] object-cover rounded"
                />

                <div className="md:grid flex flex-col grid-cols-6">
                  <div className="col-span-5 p-5">
                    <h1>{product.title}</h1>
                    <div className="flex space-x-2">
                      <Chip color="danger">
                        {calculateDiscount(product.price)}% Off
                      </Chip>
                      <h1 className="line-through italic">
                        {formatPrice(product.price.mrp)}
                      </h1>
                    </div>
                    <div className="flex space-x-2">
                      <h1 className="line-through italic">
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
                    >
                      <FaPlus />
                    </Button>
                    <Button
                      isIconOnly
                      onPress={() =>
                        updateCart({ product, quantity: -quantity })
                      }
                      variant="solid"
                      size="sm"
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
        <div className="md:block flex justify-between items-end">
          <div className="text-right">
            <h1 className="font-semibold text-xl">Cart Total</h1>
            <Divider />
            <p className="line-through">{formatPrice(subTotal)}</p>
            <p className="font-semibold text-xl">{formatPrice(totalPrice)}</p>
          </div>

          <div className="text-right md:mt-3">
            <Button
              color="danger"
              radius="sm"
              size="lg"
              startContent={<MdOutlineShoppingCartCheckout size={18} />}
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
      </h1>
    </div>
  );
};

export default Cart;

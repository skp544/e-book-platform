import { createContext, ReactNode, useEffect, useState } from "react";
import { CartItem, ICartContext } from "../types";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartState,
  updateCartId,
  updateCartItems,
  updateCartState,
} from "../store/cartSlice";
import useAuth from "../hooks/useAuth";
import { getCartApi, updateCartApi } from "../apis/cart";
import toast from "react-hot-toast";

interface Props {
  children: ReactNode;
}

export const CartContext = createContext<ICartContext>({
  items: [],
  updateCart() {},
  pending: false,
  totalCount: 0,
  fetching: true,
  subTotal: 0,
  totalPrice: 0,
});

const CartProvider = ({ children }: Props) => {
  const cart = useSelector(getCartState);
  const dispatch = useDispatch();
  const { profile } = useAuth();

  const [pending, setPending] = useState(false);
  const [fetching, setFetching] = useState(true);

  const updateCart = async (item: CartItem) => {
    dispatch(updateCartItems(item));

    const formData = {
      items: [
        {
          product: item.product.id,
          quantity: item.quantity,
        },
      ],
    };

    if (profile) {
      setPending(true);
      const response = await updateCartApi(formData);
      setPending(false);
      if (!response.success) {
        return toast.error(response.message);
      }
      dispatch(updateCartId(response.data.cart));
      toast.success(response.message);
    }
  };

  const fetchCartInfo = async () => {
    const response = await getCartApi();
    setFetching(false);
    if (!response?.success) {
      return toast.error(response?.message || "An error occurred");
    }

    dispatch(
      updateCartState({ id: response.data.id, items: response.data.items })
    );
  };

  useEffect(() => {
    fetchCartInfo();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: cart.items,
        totalCount: cart.totalCounts,
        updateCart,
        pending,
        fetching,
        subTotal: cart.subTotal,
        totalPrice: cart.totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

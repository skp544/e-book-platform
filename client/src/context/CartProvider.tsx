import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { CartItem, ICartContext } from "../types";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartState,
  updateCartId,
  updateCartItems,
  updateCartState,
} from "../redux/slices/cartSlice.ts";
import useAuth from "../hooks/useAuth.ts";
import { addToast } from "@heroui/react";
import { clearCartApi, getCartApi, updateCartApi } from "../apis/cart.ts";

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
  clearCart() {},
});

const CART_KEY = "cartItems";

const updateCartInLS = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

let startLSUpdate = false;

const CartProvider: FC<Props> = ({ children }) => {
  const cart = useSelector(getCartState);
  const dispatch = useDispatch();
  const { profile, status } = useAuth();

  const [pending, setPending] = useState(false);
  const [fetching, setFetching] = useState(true);

  const clearCart = async () => {
    dispatch(updateCartState({ items: [], id: "" }));

    if (profile) {
      setPending(true);
      const response = await clearCartApi();
      setPending(false);
      if (!response.success) {
        return addToast({
          color: "danger",
          title: "Error",
          description: response.message,
        });
      }

      addToast({
        color: "success",
        title: "Cleared",
        description: response.message,
      });
    }
  };

  const updateCart = async (item: CartItem) => {
    startLSUpdate = true;
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
        return addToast({
          color: "danger",
          title: "Error",
          description: response.message,
        });
      }
      dispatch(updateCartId(response.data.cart));
      addToast({
        color: "success",
        title: "Updated",
        description: response.message,
      });
    }
  };

  const fetchCartInfo = async () => {
    if (!profile) {
      const items = localStorage.getItem(CART_KEY);
      if (items) {
        dispatch(updateCartState({ items: JSON.parse(items) }));
      }
      return setFetching(false);
    }

    const response = await getCartApi();

    setFetching(false);
    if (!response?.success) {
      return addToast({
        color: "danger",
        title: "Error",
        description: response.message,
      });
    }

    dispatch(
      updateCartState({ id: response.data.id, items: response.data.items }),
    );
  };

  useEffect(() => {
    if (startLSUpdate && !profile) {
      updateCartInLS(cart.items);
    }
  }, [cart.items, profile]);

  useEffect(() => {
    fetchCartInfo();
  }, [status]);

  return (
    <CartContext.Provider
      value={{
        id: cart.id,
        items: cart.items,
        totalCount: cart.totalCounts,
        updateCart,
        pending,
        fetching,
        subTotal: cart.subTotal,
        totalPrice: cart.totalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;

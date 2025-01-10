import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, ICartState, RootState } from "../types";

const initialState: ICartState = {
  items: [],
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCartId(state, { payload }: PayloadAction<string>) {
      state.id = payload;
    },

    updateCart(state, { payload }: PayloadAction<ICartState>) {
      state.id = payload.id;
      state.items = payload.items;
    },

    updateCartItems(state, { payload }: PayloadAction<CartItem>) {
      const index = state.items.findIndex(
        (item) => item.product.id === payload.product.id
      );

      if (index === -1) {
        state.items.push(payload);
      } else {
        state.items[index].quantity += payload.quantity;
        if (state.items[index].quantity <= 0) {
          state.items.splice(index, 1);
        }
      }
    },
  },
});

export const getCartState = createSelector(
  (state: RootState) => state,
  ({ cart }) => {
    return {
      totalCounts: cart.items.reduce((total, cartItem) => {
        total += cartItem.quantity;
        return total;
      }, 0),
      ...cart,
    };
  }
);

export const { updateCart, updateCartId, updateCartItems } = slice.actions;

export default slice.reducer;

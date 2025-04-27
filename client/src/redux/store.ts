import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.ts";
import cartReducer from "./slices/cartSlice.ts";

const reducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const store = configureStore({ reducer });

export default store;

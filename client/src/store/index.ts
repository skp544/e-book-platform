import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

const reducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const store = configureStore({ reducer });

export default store;

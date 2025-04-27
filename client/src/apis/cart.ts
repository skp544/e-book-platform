import { catchError } from "../helpers";
import client from "./client.ts";
import { IUpdateCartApi } from "../types";

export const updateCartApi = async (formData: IUpdateCartApi) => {
  try {
    const { data } = await client.post("/cart", formData);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getCartApi = async () => {
  try {
    const { data } = await client("/cart/get");

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const clearCartApi = async () => {
  try {
    const { data } = await client("/cart/clear");
    return data;
  } catch (error) {
    return catchError(error);
  }
};

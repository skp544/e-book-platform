import { catchError } from "../helper";
import { CartApiResponse, IUpdateCartApi } from "../types";
import client from "./client";

export const updateCartApi = async (formData: IUpdateCartApi) => {
  try {
    const { data } = await client.post("/cart", formData);
    return data;
  } catch (error) {
    catchError(error);
  }
};

export const getCartApi = async () => {
  try {
    const { data } = await client<CartApiResponse>("/cart");
    return data;
  } catch (error) {
    catchError(error);
  }
};

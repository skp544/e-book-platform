import { catchError } from "../helper";
import client from "./client";

export const checkoutApi = async (formData: { cartId: string }) => {
  try {
    const { data } = await client.post("/checkout", formData);

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const instantCheckoutApi = async (formData: { productId: string }) => {
  try {
    const { data } = await client.post("/checkout/instant", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

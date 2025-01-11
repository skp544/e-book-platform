import { catchError } from "../helper";
import client from "./client.ts";

export const orderSuccessApi = async (formData: { sessionId: string }) => {
  try {
    const { data } = await client.post("/order/success", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const getOrdersApi = async () => {
  try {
    const { data } = await client("/order");

    return data;
  } catch (e) {
    return catchError(e);
  }
};

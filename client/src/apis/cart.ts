import { catchError } from "../helper";
import { IUpdateCartApi } from "../types";
import client from "./client";

export const updateCartApi = async (formData: IUpdateCartApi) => {
  try {
    const { data } = await client.post("/cart", formData);
    return data;
  } catch (error) {
    catchError(error);
  }
};

import { catchError } from "../helper/index.ts";
import client from "./client.ts";

export const createNewBookApi = async (formData: FormData) => {
  try {
    const { data } = await client.post("/book/create", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

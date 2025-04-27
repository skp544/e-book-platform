import { AuthorInfo } from "../types";
import { catchError } from "../helpers";
import client from "./client.ts";

export const registerAuthorApi = async (formData: AuthorInfo) => {
  try {
    const { data } = await client.post("/author/register", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const getAuthorDetailsApi = async (id: string | undefined) => {
  try {
    const response = await client(`/author/${id}`);
    return response.data;
  } catch (error) {
    return catchError(error);
  }
};

export const updateAuthorApi = async (formData: AuthorInfo) => {
  try {
    const { data } = await client.patch("/author/update", formData);

    return data;
  } catch (error) {
    return catchError(error);
  }
};

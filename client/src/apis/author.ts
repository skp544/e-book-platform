import { catchError } from "../helper";
import { AuthorInfo } from "../types";
import client from "./client";

export const registerAuthorApi = async (data: AuthorInfo) => {
  try {
    const response = await client.post("/author/register", data);
    return response.data;
  } catch (error) {
    return catchError(error);
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

export const updateAuthorApi = async (data: AuthorInfo) => {
  try {
    const response = await client.patch("/author", data);
    return response.data;
  } catch (error) {
    return catchError(error);
  }
};

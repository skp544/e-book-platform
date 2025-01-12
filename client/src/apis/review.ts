import { catchError } from "../helper";
import client from "./client.ts";
import { IAddReviewFormData } from "../types";

export const addReviewApi = async (formData: IAddReviewFormData) => {
  try {
    const { data } = await client.post("/review", formData);
    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const getReviewApi = async (bookId: string) => {
  try {
    const { data } = await client(`/review/${bookId}`);
    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const getPublicReviewApi = async (bookId: string) => {
  try {
    const { data } = await client(`/review/list/${bookId}`);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

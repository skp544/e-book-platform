import { catchError } from "../helper";
import client from "./client.ts";

export const createNewBookApi = async (formData: FormData) => {
  try {
    const { data } = await client.post("/book/create", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const bookDetailsApi = async (slug: string) => {
  try {
    const { data } = await client.get(`/book/details/${slug}`);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const updateBookApi = async (formData: FormData) => {
  try {
    const { data } = await client.patch("/book", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const featuredBooksApi = async () => {
  try {
    const { data } = await client.get("/book/featured");

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const booksByGenreApi = async (genre: string) => {
  try {
    const { data } = await client.get(`/book/by-genre/${genre}`);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const booksByPublicDetailApi = async (slug: string) => {
  try {
    const { data } = await client.get(`/book/details/${slug}`);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

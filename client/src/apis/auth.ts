import { catchError } from "../helper";
import client from "./client.ts";

export const generateLinkApi = async (formData: { email: string }) => {
  try {
    const { data } = await client.post("/auth/generate-link", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const updateProfileApi = async (formData: FormData) => {
  try {
    const { data } = await client.put("/auth/update-profile", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const getProfileApi = async () => {
  try {
    const { data } = await client("/auth/profile");
    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const logoutApi = async () => {
  try {
    const { data } = await client.post("/auth/logout");
    return data;
  } catch (e) {
    return catchError(e);
  }
};

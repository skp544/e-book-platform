import { catchError } from "../helpers";
import client from "./client.ts";

interface GenerateLink {
  email: string;
}

export const generateLink = async (formData: GenerateLink) => {
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
    const { data } = await client.get("/auth/profile");

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

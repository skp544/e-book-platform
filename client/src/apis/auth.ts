import { catchError } from "../helper";
import client from "./client.ts";

export const generateLink = async (formData: { email: string }) => {
  try {
    const { data } = await client.post("/auth/generate-link", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

export const updateProfile = async (formData: FormData) => {
  try {
    const { data } = await client.put("/auth/update-profile", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

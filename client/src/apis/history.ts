import { catchError } from "../helpers";
import client from "./client.ts";

interface BookHistory {
  bookId: string | null;
  highlights: {
    selection: string;
    fill: string;
  }[];
  remove: boolean;
}

export const bookHistoryApi = async (formData: BookHistory) => {
  try {
    const { data } = await client.post("/history", formData);

    return data;
  } catch (e) {
    return catchError(e);
  }
};

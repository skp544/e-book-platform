import { AxiosError } from "axios";
import { APIError, CatchErrorResponse } from "../types";

export const catchError = (error: unknown): CatchErrorResponse => {
  if (error instanceof AxiosError) {
    const { response, message } = error;

    if (response) {
      const data = response.data as APIError;

      if (data?.errors && typeof data.errors === "object") {
        const messages = Object.values(data.errors).flat().join(", ");
        return {
          message: messages || "Validation failed.",
          success: false,
        };
      }

      if (data?.error) {
        return {
          message: data.error,
          success: false,
        };
      }

      if (data?.message) {
        return {
          message: data.message,
          success: false,
        };
      }

      if (
        typeof data === "string" &&
        data?.trim().startsWith("<!DOCTYPE html>")
      ) {
        return {
          message: "Something went wrong. Please try again later.",
          success: false,
        };
      }

      return {
        message: "An error occurred while processing your request.",
        success: false,
      };
    }

    return {
      message: message || "Network error. Please try again.",
      success: false,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      success: false,
    };
  }

  return {
    message: "An unknown error occurred.",
    success: false,
  };
};

export const emailRegex = new RegExp(
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
);

export const calculateDiscount = (price: {
  mrp: number | string;
  sale: number | string;
}) => {
  const { mrp, sale } = price;

  if (typeof mrp === "string" || typeof sale === "string") {
    const mrpNumber = Number(mrp);
    const saleNumber = Number(sale);
    return Math.round(((mrpNumber - saleNumber) / mrpNumber) * 100);
  }

  return Math.round(((mrp - sale) / mrp) * 100);
};

export const formatPrice = (amount: string | number | undefined) => {
  if (typeof amount === "string") {
    const amountNumber = Number(amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amountNumber);
  }

  if (typeof amount === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  return amount;
};

export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  time: number,
) => {
  let timeoutId: number;

  return (...args: T) => {
    // clearing the previous timeout (invalidates the previous function call)
    clearTimeout(timeoutId);

    // registers the new timeout (registers the new function to call after the given time)
    timeoutId = setTimeout(() => {
      func(...args);
    }, time);
  };
};

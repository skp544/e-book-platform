export const emailRegex = new RegExp(
  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
);

export const catchError = (error) => {
  const { response } = error;

  if (response) {
    const { status, data } = response;

    // Check if the response contains HTML (e.g., returned as a string containing HTML tags)
    if (typeof data === "string" && data.trim().startsWith("<!DOCTYPE html>")) {
      return {
        message: `Something went wrong. Please try again later.`,
        success: false,
      };
    }

    // Handle errors with an 'errors' object
    if (data && data.errors) {
      const errorMessages = Object.values(data.errors).flat().join(", ");
      return {
        message: errorMessages || "An error occurred.",
        success: false,
        data,
      };
    }

    // If response data exists and is an object, return it
    if (data) {
      return {
        message: data.message || "An error occurred.",
        success: false,
        data,
      };
    }

    // Default case for a response without data
    return {
      message: `Request failed with status code ${status}.`,
      success: false,
    };
  }

  // Handle errors without a response (e.g., network errors)
  return {
    message: error.message || "An unknown error occurred.",
    success: false,
  };
};

export const calculateDiscount = (price: { mrp: number; sale: number }) => {
  const { mrp, sale } = price;

  return Math.round(((mrp - sale) / mrp) * 100);
};

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

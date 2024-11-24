import { ErrorRequestHandler } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof JsonWebTokenError) {
    res.status(401).json({ success: false, message: error.message });
  }
  res.status(500).json({ success: false, message: error.message });
};

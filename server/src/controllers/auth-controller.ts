import { Request, Response, RequestHandler } from "express";
import crypto from "crypto";

export const generateLink: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const randomToken = crypto.randomBytes(36).toString("hex");
  } catch (error) {}
};

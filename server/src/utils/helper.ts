import { UserDoc } from "@/models/user-model";
import { Request, Response } from "express";

type ErrorResponseType = {
  status: number;
  message: string;
  res: Response;
};

export const sendErrorResponse = ({
  res,
  message,
  status,
}: ErrorResponseType) => {
  res.status(status).json({
    success: false,
    message,
  });
};

export const formatUserProfile = (user: UserDoc): Request["user"] => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

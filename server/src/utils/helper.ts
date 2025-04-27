import { Response, Request } from "express";
import { UserDoc } from "@/models/user-model";
import { JsonWebTokenError } from "jsonwebtoken";

type ErrorResponseType = {
  res: Response;
  message?: string;
  status?: number;
};

export const sendErrorResponse = ({
  res,
  status = 500,
  message = "Internal Server Error",
}: ErrorResponseType) => {
  res.status(status).json({ success: false, message });
};

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof JsonWebTokenError) {
    return sendErrorResponse({
      res,
      status: 401,
      message: error.message,
    });
  }

  if (error instanceof Error) {
    return sendErrorResponse({
      res,
      message: error.message,
    });
  }

  // Handle unknown error structure
  return sendErrorResponse({
    res,
    message: "Internal Server Error",
  });
};

export const formatUserProfile = (user: UserDoc): Request["user"] => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    signedUp: user.signedUp,
    avatar: user.avatar?.url,
    authorId: user.authorId?.toString(),
    books: user.books.map((b) => b.toString()),
  };
};

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const generateS3ClientPublicUrl = (
  bucketName: string,
  uniqueKey: string
): string => {
  return `https://${bucketName}.s3.amazonaws.com/${uniqueKey}`;
};

export const sanitizeUrl = (url: string) => {
  return url.replace(/ /g, "%20");
};

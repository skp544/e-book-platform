import User from "@/models/user-model";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper";
import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import {AddReviewRequestHandler, IsPurchasedByTheUserHandler} from "@/types";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        name?: string;
        email: string;
        role: "user" | "author";
        avatar?: string;
        signedUp: boolean;
        authorId?: string;
      };
    }
  }
}

export const isAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies?.authToken;

  if (!authToken) {
    return sendErrorResponse({
      res,
      message: "Unauthorized",
      status: 401,
    });
  }

  const payload = jwt.verify(authToken, process.env.JWT_SECRET!) as {
    userId: string;
  };

  const user = await User.findById(payload.userId);

  if (!user) {
    return sendErrorResponse({
      message: "Unauthorized request user not found!",
      status: 401,
      res,
    });
  }

  req.user = formatUserProfile(user);

  next();
};

export const isAuthor: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role === "author") next();
  else
    sendErrorResponse({
      message: "Invalid Request",
      res,
      status: 401,
    });
};

export const isPurchasedByTheUser: IsPurchasedByTheUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({ _id: req.user.id, books: req.body.bookId });

  if (!user) {
    return sendErrorResponse({
      res,
      message: "Sorry you have not purchased this book yet",
      status: 403,
    });
  }

  next();
};



import { NextFunction, RequestHandler, Response, Request } from "express";
import {
  formatUserProfile,
  handleError,
  sendErrorResponse,
} from "@/utils/helper";
import jwt from "jsonwebtoken";
import UserModel from "@/models/user-model";
import { AddReviewRequestHandler, IsPurchasedByTheUserHandler } from "@/types";
import BookModel from "@/models/book-model";

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
        books?: string[];
      };
    }
  }
}

/**
 * @desc Middleware to check if the user is authenticated
 * @param req
 * @param res
 * @param next
 * @cookie { authToken: string }
 * @returns { void }
 *
 */

export const isAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return sendErrorResponse({
        status: 401,
        message: "Unauthorized Request",
        res,
      });
    }

    const payload = jwt.verify(authToken, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await UserModel.findById(payload.userId);

    if (!user) {
      return sendErrorResponse({
        status: 401,
        message: "Unauthorized Request user not found!",
        res,
      });
    }

    req.user = formatUserProfile(user);

    next();
  } catch (error) {
    handleError(error, res);
  }
};

export const isAuthor: RequestHandler = async (req, res, next) => {
  try {
    if (req.user.role === "author") {
      next();
    } else {
      return sendErrorResponse({
        status: 401,
        message: "Unauthorized Request",
        res,
      });
    }
  } catch (e) {
    handleError(e, res);
  }
};

export const isPurchasedByTheUser: IsPurchasedByTheUserHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await UserModel.findOne({
      _id: req.user.id,
      books: req.body.bookId,
    });

    if (!user) {
      return sendErrorResponse({
        status: 401,
        message: "Sorry we didn't find book inside your library!",
        res,
      });
    }

    next();
  } catch (e) {
    handleError(e, res);
  }
};

export const isValidReadingRequest: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url: string = req.url;
    const regex = new RegExp("/([^/?]+.epub)");

    const regexMatch = url.match(regex);

    if (!regexMatch) {
      return sendErrorResponse({
        res,
        message: "Invalid Request",
        status: 403,
      });
    }

    const bookFileId: string = regexMatch[1];

    const book = await BookModel.findOne({ "fileInfo.id": bookFileId });

    if (!book) {
      return sendErrorResponse({
        res,
        message: "Invalid Request",
        status: 403,
      });
    }

    const user = await UserModel.findOne({ _id: req.user.id, books: book._id });

    if (!user) {
      return sendErrorResponse({
        res,
        message: "Unauthorized Request!",
        status: 403,
      });
    }

    next();
  } catch (e) {
    handleError(e, res);
  }
};

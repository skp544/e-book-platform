import User from "@/models/user-model";
import { sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        name?: string;
        email: string;
        role: "user" | "author";
      };
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {
  console.log(req.cookies);
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

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
};

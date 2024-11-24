import { Request, Response, RequestHandler } from "express";
import crypto from "crypto";
import VerificationToken from "@/models/verification-token-model";
import User from "@/models/user-model";
import mail from "@/utils/mail";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper";
import jwt from "jsonwebtoken";

export const generateLink: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  const userId = user._id.toString();

  // Delete any existing token
  await VerificationToken.findOneAndDelete({ userId });

  const randomToken = crypto.randomBytes(36).toString("hex");

  await VerificationToken.create<{ userId: string }>({
    userId,
    token: randomToken,
  });

  const link = `${process.env.VERIFICATION_LINK}?token=${randomToken}&userId=${userId}`;

  await mail.sendVerificationMail({
    link,
    to: user.email,
  });

  res.json({
    success: true,
    message: "Please check your email for link.",
  });
};

export const verifyAuthToken: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { token, userId } = req.query;

  if (typeof token !== "string" || typeof userId !== "string") {
    return sendErrorResponse({
      status: 403,
      message: "Invalid request!",
      res,
    });
  }

  const verificationToken = await VerificationToken.findOne({
    userId,
  });

  if (!verificationToken || !verificationToken.compare(token)) {
    return sendErrorResponse({
      status: 403,
      message: "Invalid request, Token Mismatch!",
      res,
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return sendErrorResponse({
      status: 500,
      message: "Something went wrong!",
      res,
    });
  }

  await VerificationToken.findByIdAndDelete(verificationToken._id);

  // TODO: Authentication
  const payload = { userId: user._id };

  const authToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15d",
  });

  res.cookie("authToken", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  });

  // res.redirect(
  //   `${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(
  //     formatUserProfile(user)
  //   )}`
  // );

  res.send();
};

export const sendProfileInfo: RequestHandler = async (
  req: Request,
  res: Response
) => {
  res.json({
    profile: req.user,
  });
};

export const logout: RequestHandler = async (req: Request, res: Response) => {
  res.clearCookie("authToken").send();
};

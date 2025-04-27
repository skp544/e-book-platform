import { Request, RequestHandler, Response } from "express";
import crypto from "crypto";
import VerificationTokenModel from "@/models/verification-token-model";
import UserModel from "@/models/user-model";
import mail from "@/utils/mail";
import {
  formatUserProfile,
  handleError,
  sendErrorResponse,
} from "@/utils/helper";
import jwt from "jsonwebtoken";
import { uploadAvatarToCloudinary } from "@/utils/file-upload";
import slugify from "slugify";

/**
 * @desc Generate a link for the user to authenticate
 * @param req
 * @param res
 * @body { email: string }
 * @returns { success: boolean, message: string }
 */

export const generateAuthLink: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({ email });
    }
    const userId = user._id.toString();

    await VerificationTokenModel.findOneAndDelete({
      userId,
    });

    const randomToken = crypto.randomBytes(36).toString("hex");

    await VerificationTokenModel.create<{ userId: string }>({
      userId,
      token: randomToken,
    });

    const link = `${process.env.VERIFICATION_LINK}?token=${randomToken}&userId=${userId}`;

    await mail.sendVerificationMail({
      link,
      to: user.email,
    });

    res.json({ success: true, message: "Please check your email for link." });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * @desc Verify the authentication token
 * @param req
 * @param res
 * @query { token: string, userId: string }
 * @returns cookie { authToken: string }
 */

export const verifyAuthToken: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { token, userId } = req.query;

  if (typeof token !== "string" || typeof userId !== "string") {
    return sendErrorResponse({ status: 403, message: "Invalid Request", res });
  }

  const verificationToken = await VerificationTokenModel.findOne({ userId });

  if (!verificationToken || !verificationToken.compare(token)) {
    return sendErrorResponse({
      status: 403,
      message: "Invalid request. Token mismatch!",
      res,
    });
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    return sendErrorResponse({
      status: 500,
      message: "Something went wrong. Please try again!",
      res,
    });
  }

  await VerificationTokenModel.findByIdAndDelete(verificationToken._id);

  const payload = { userId: user._id };

  const authToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15d",
  });
  // authentication
  res.cookie("authToken", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  });
  res.redirect(
    `${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(user)}`
  );

  res.send();
};

export const sendProfileInfo: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    res.status(200).json({ data: req.user });
  } catch (error) {
    handleError(error, res);
  }
};

export const logout: RequestHandler = async (req: Request, res: Response) => {
  try {
    res.clearCookie("authToken").json({ message: "Logged out successfully" });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { name, signedUp: true },
      { new: true }
    );

    if (!user) {
      return sendErrorResponse({
        message: "User not found!",
        res,
      });
    }

    // if the file update on the cloud and update the database
    const file = req.files.avatar;

    if (file && !Array.isArray(file)) {
      user.avatar = await uploadAvatarToCloudinary(file, user.avatar?.id);

      // const uniqueFileName = `${user._id}-${slugify(user.name, {
      //   lower: true,
      //   replacement: "-",
      // })}.png`;

      // user.avatar = await uploadAvatarToAWS(
      //   file,
      //   uniqueFileName,
      //   user.avatar?.id,
      // );
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Data Updated Successfully!",
      data: formatUserProfile(user),
    });
  } catch (error) {
    handleError(error, res);
  }
};

import { Request, Response, RequestHandler } from "express";
import crypto from "crypto";
import VerificationToken from "@/models/verification-token-model";
import User from "@/models/user-model";
import mail from "@/utils/mail";

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

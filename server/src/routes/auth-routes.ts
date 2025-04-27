import { Router } from "express";
import {
  generateAuthLink,
  logout,
  sendProfileInfo,
  updateProfile,
  verifyAuthToken,
} from "@/controllers/auth-controller";
import {
  emailValidationSchema,
  newUserSchema,
  validate,
} from "@/middlewares/validator";
import { isAuth } from "@/middlewares/auth-middleware";
import { fileParser } from "@/middlewares/file-middleware";

const router = Router();

router.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink,
);

router.get("/verify", verifyAuthToken);

router.get("/profile", isAuth, sendProfileInfo);

router.post("/logout", isAuth, logout);

router.put(
  "/update-profile",
  isAuth,
  fileParser,
  validate(newUserSchema),
  updateProfile,
);

export default router;

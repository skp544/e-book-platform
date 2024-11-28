import {
  generateLink,
  logout,
  sendProfileInfo,
  updateProfile,
  verifyAuthToken,
} from "@/controllers/auth-controller";
import { isAuth } from "@/middlewares/auth-middleware";
import { fileParser } from "@/middlewares/file-middleware";
import {
  emailValidationSchema,
  newUserSchema,
  validate,
} from "@/middlewares/validate-middleware";
import { Router } from "express";

const router = Router();

router.post("/generate-link", validate(emailValidationSchema), generateLink);

router.get("/verify", verifyAuthToken);

router.get("/profile", isAuth, sendProfileInfo);

router.post("/logout", isAuth, logout);

router.put(
  "/update-profile",
  isAuth,
  fileParser,
  validate(newUserSchema),
  updateProfile
);

export default router;

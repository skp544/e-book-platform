import {
  generateLink,
  logout,
  sendProfileInfo,
  verifyAuthToken,
} from "@/controllers/auth-controller";
import { isAuth } from "@/middlewares/auth-middleware";
import {
  emailValidationSchema,
  validate,
} from "@/middlewares/validate-middleware";
import { Router } from "express";

const router = Router();

router.post("/generate-link", validate(emailValidationSchema), generateLink);

router.get("/verify", verifyAuthToken);

router.get("/profile", isAuth, sendProfileInfo);

router.post("/logout", isAuth, logout);
export default router;

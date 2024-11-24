import { generateLink, verifyAuthToken } from "@/controllers/auth-controller";
import {
  emailValidationSchema,
  validate,
} from "@/middlewares/validate-middleware";
import { Router } from "express";

const router = Router();

router.post("/generate-link", validate(emailValidationSchema), generateLink);

router.get("/verify", verifyAuthToken);

export default router;

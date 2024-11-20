import { generateLink } from "@/controllers/auth-controller";
import {
  emailValidationSchema,
  validate,
} from "@/middlewares/validate-middleware";
import { Router } from "express";

const router = Router();

router.post("/generate-link", validate(emailValidationSchema), generateLink);

export default router;

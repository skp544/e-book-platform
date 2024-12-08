import { Router } from "express";
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth-middleware";
import {
  historyValidationSchema,
  validate,
} from "@/middlewares/validate-middleware";
import { updateBookHistory } from "@/controllers/history-controller";

const router = Router();

router.post(
  "/",
  isAuth,
  validate(historyValidationSchema),
  // isPurchasedByTheUser,
  updateBookHistory
);

export default router;

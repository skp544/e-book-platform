import { Router } from "express";
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth-middleware";
import {
  historyValidationSchema,
  validate,
} from "@/middlewares/validate-middleware";
import {
  getBookHistory,
  updateBookHistory,
} from "@/controllers/history-controller";

const router = Router();

router.post(
  "/",
  isAuth,
  validate(historyValidationSchema),
  isPurchasedByTheUser,
  updateBookHistory
);

router.get("/:bookId", isAuth, getBookHistory);

export default router;

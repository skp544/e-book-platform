import { Router } from "express";
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth-middleware";
import {
  getBookHistory,
  updateBookHistory,
} from "@/controllers/history-controller";
import { historyValidationSchema, validate } from "@/middlewares/validator";

const router = Router();

router.post(
  "/",
  isAuth,
  validate(historyValidationSchema),
  isPurchasedByTheUser,
  updateBookHistory,
);

router.get("/:bookId", isAuth, getBookHistory);
export default router;

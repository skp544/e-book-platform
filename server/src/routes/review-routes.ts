import { Router } from "express";
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth-middleware";
import {
  addReview,
  getPublicReviews,
  getReview,
} from "@/controllers/review-controller";
import { newReviewSchema, validate } from "@/middlewares/validator";

const router = Router();

router.post(
  "/",
  isAuth,
  validate(newReviewSchema),
  isPurchasedByTheUser,
  addReview,
);

router.get("/:bookId", isAuth, getReview);

router.get("/list/:bookId", getPublicReviews);
export default router;

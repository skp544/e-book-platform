import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth-middleware";
import { Router } from "express";
import {
  addReview,
  getPublicReviews,
  getReview,
} from "@/controllers/review-controller";
import { newReviewSchema, validate } from "@/middlewares/validate-middleware";

const router = Router();

router.post(
  "/",
  isAuth,
  validate(newReviewSchema),
  isPurchasedByTheUser,
  addReview
);

router.get("/:bookId", isAuth, getReview);
router.get("/list/:bookId", getPublicReviews);

export default router;

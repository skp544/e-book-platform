import { isAuth } from "@/middlewares/auth-middleware";
import { Router } from "express";
import { addReview } from "@/controllers/review-controller";
import {newReviewSchema, validate} from "@/middlewares/validate-middleware";

const router = Router();

router.post("/add", isAuth, validate(newReviewSchema), addReview);

export default router;

import { Router } from "express";
import { isAuth, isAuthor } from "@/middlewares/auth-middleware";
import { newAuthorSchema, validate } from "@/middlewares/validator";
import {
  getAuthorDetails,
  registerAuthor,
  updateAuthor,
} from "@/controllers/author-controller";

const router = Router();

router.post("/register", isAuth, validate(newAuthorSchema), registerAuthor);

router.get("/:id", getAuthorDetails);

router.patch(
  "/update",
  isAuth,
  isAuthor,
  validate(newAuthorSchema),
  updateAuthor
);

export default router;

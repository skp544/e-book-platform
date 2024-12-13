import {
  getAuthorDetails,
  registerAuthor,
  updateAuthor,
} from "@/controllers/author-controller";
import { isAuth, isAuthor } from "@/middlewares/auth-middleware";
import { newAuthorSchema, validate } from "@/middlewares/validate-middleware";
import { Router } from "express";

const router = Router();

router.post("/register", isAuth, validate(newAuthorSchema), registerAuthor);

router.patch("/", isAuth, isAuthor, validate(newAuthorSchema), updateAuthor);

router.get("/:slug", getAuthorDetails);

export default router;

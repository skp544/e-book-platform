import {
  getAuthorDetails,
  registerAuthor,
} from "@/controllers/author-controller";
import { isAuth } from "@/middlewares/auth-middleware";
import { newAuthorSchema, validate } from "@/middlewares/validate-middleware";
import { Router } from "express";

const router = Router();

router.post("/register", isAuth, validate(newAuthorSchema), registerAuthor);

router.get("/:slug", getAuthorDetails);

export default router;

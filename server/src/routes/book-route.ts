import { createNewBook } from "@/controllers/book-controller";
import { isAuth, isAuthor } from "@/middlewares/auth-middleware";
import { fileParser } from "@/middlewares/file-middleware";
import { newBookSchema, validate } from "@/middlewares/validate-middleware";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  isAuth,
  isAuthor,
  fileParser,
  validate(newBookSchema),
  createNewBook
);

export default router;

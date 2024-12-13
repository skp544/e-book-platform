import {
  createNewBook,
  getAllPurchasedBooks,
  getBooksByGenre,
  getBooksPublicDetails,
  updateBook
} from "@/controllers/book-controller";
import { isAuth, isAuthor } from "@/middlewares/auth-middleware";
import { fileParser } from "@/middlewares/file-middleware";
import {
  newBookSchema,
  updateBookSchema,
  validate,
} from "@/middlewares/validate-middleware";
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

router.patch(
  "/",
  isAuth,
  isAuthor,
  fileParser,
  validate(updateBookSchema),
  updateBook
);

router.get("/list", isAuth, getAllPurchasedBooks);

router.get("/details/:slug", getBooksPublicDetails)

router.get("/by-genre/:genre", getBooksByGenre)

export default router;

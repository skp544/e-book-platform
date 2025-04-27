import { Router } from "express";
import { isAuth, isAuthor } from "@/middlewares/auth-middleware";
import { fileParser } from "@/middlewares/file-middleware";
import {
  newBookSchema,
  updateBookSchema,
  validate,
} from "@/middlewares/validator";
import {
  createNewBook,
  generateBookAccessUrl,
  getAllBooks,
  getAllPurchasedBooks,
  getBooksByGenre,
  getBooksPublicDetails,
  getFeaturedBooks,
  getRecommendedBooks,
  updateBook,
} from "@/controllers/book-controller";

const router = Router();

router.post(
  "/create",
  isAuth,
  isAuthor,
  fileParser,
  validate(newBookSchema),
  createNewBook,
);

router.patch(
  "/update",
  isAuth,
  isAuthor,
  fileParser,
  validate(updateBookSchema),
  updateBook,
);

router.get("/list", isAuth, getAllPurchasedBooks);

router.get("/details/:slug", getBooksPublicDetails);

router.get("/by-genre/:genre", getBooksByGenre);

router.get("/read/:slug", isAuth, generateBookAccessUrl);

router.get("/recommended/:bookId", getRecommendedBooks);

router.get("/featured", getFeaturedBooks);

router.get("/get-all-books", getAllBooks);

export default router;

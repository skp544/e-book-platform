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
import {
  isAuth,
  isAuthor,
  isPurchasedByTheUser,
} from "@/middlewares/auth-middleware";
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

router.get("/details/:slug", getBooksPublicDetails);

router.get("/by-genre/:genre", getBooksByGenre);

router.get("/read/:slug", isAuth, generateBookAccessUrl);

router.get("/recommended/:bookId", getRecommendedBooks);

router.get("/featured", getFeaturedBooks);

router.get("/get-all-books", getAllBooks);

export default router;

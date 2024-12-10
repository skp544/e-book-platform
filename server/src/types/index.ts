import {
  historyValidationSchema,
  newAuthorSchema,
  newBookSchema,
  newReviewSchema,
  updateBookSchema,
} from "@/middlewares/validate-middleware";
import { RequestHandler } from "express";
import { ObjectId, Schema } from "mongoose";
import { z } from "zod";

type AuthorHandlerBody = z.infer<typeof newAuthorSchema>;
type NewBookBody = z.infer<typeof newBookSchema>;
type UpdateBookBody = z.infer<typeof updateBookSchema>;
type AddReviewBody = z.infer<typeof newReviewSchema>;
type HistoryBookBody = z.infer<typeof historyValidationSchema>;

type PurchasedByTheUserBody = { bookId: string };

// type CustomRequestHandler<T> =

export type RequestAuthorHandler = RequestHandler<{}, {}, AuthorHandlerBody>;

export type CreateBookRequestHandler = RequestHandler<{}, {}, NewBookBody>;

export type UpdateBookRequestHandler = RequestHandler<{}, {}, UpdateBookBody>;

export type AddReviewRequestHandler = RequestHandler<{}, {}, AddReviewBody>;

export type UpdateHistoryRequestHandler = RequestHandler<
  {},
  {},
  HistoryBookBody
>;

export type IsPurchasedByTheUserHandler = RequestHandler<
  {},
  {},
  PurchasedByTheUserBody
>;

export interface PopulatedBooks {
  map(
    arg0: (book: PopulatedBooks) => {
      id: Schema.Types.ObjectId;
      title: string;
      cover: string | undefined;
      slug: string;
      author: { name: string; slug: string };
    }
  ): unknown;
  cover?: {
    url: string;
    id: string;
  };
  _id: ObjectId;
  author: {
    _id: ObjectId;
    name: string;
    slug: string;
  };
  title: string;
  slug: string;
}

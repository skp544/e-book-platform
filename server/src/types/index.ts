import {
  cartItemsSchema,
  historyValidationSchema,
  newAuthorSchema,
  newBookSchema,
  newReviewSchema,
  updateBookSchema,
} from "@/middlewares/validate-middleware";
import { RequestHandler } from "express";
import { ObjectId, Schema } from "mongoose";
import { z } from "zod";
import Stripe from "stripe";

type AuthorHandlerBody = z.infer<typeof newAuthorSchema>;
type NewBookBody = z.infer<typeof newBookSchema>;
type UpdateBookBody = z.infer<typeof updateBookSchema>;
type AddReviewBody = z.infer<typeof newReviewSchema>;
type HistoryBookBody = z.infer<typeof historyValidationSchema>;
type PurchasedByTheUserBody = { bookId: string };
type CartBody = z.infer<typeof cartItemsSchema>;

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

export type CartRequestHandler = RequestHandler<{}, {}, CartBody>;



export interface PopulatedBooks {
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

  map(
    arg0: (book: PopulatedBooks) => {
      id: Schema.Types.ObjectId;
      title: string;
      cover: string | undefined;
      slug: string;
      author: { name: string; slug: string };
    }
  ): unknown;
}

export interface PopulatedUser {
  _id: ObjectId;
  name: string;
  avatar: { id: string; url: string };
}

export interface Settings {
  lastLocation: string;
  highlights: {
    selection: string;
    fill: string;
  }[];
}
export  type StripeLineItems = Stripe.Checkout.SessionCreateParams.LineItem[]

export  type options = {
  customer: Stripe.CustomerCreateParams
  line_items: StripeLineItems
}


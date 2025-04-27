import { z } from "zod";
import { RequestHandler } from "express";
import {
  cartItemsSchema,
  historyValidationSchema,
  newAuthorSchema,
  newBookSchema,
  newReviewSchema,
  updateBookSchema,
} from "@/middlewares/validator";
import { ObjectId, Schema } from "mongoose";
import Stripe from "stripe";

type AuthorHandlerBody = z.infer<typeof newAuthorSchema>;
type NewBookBody = z.infer<typeof newBookSchema>;

type UpdateBookBody = z.infer<typeof updateBookSchema>;

type AddReviewBody = z.infer<typeof newReviewSchema>;

type HistoryBookBody = z.infer<typeof historyValidationSchema>;

type PurchasedByTheUserBody = { bookId: string };

type CartBody = z.infer<typeof cartItemsSchema>;

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
    },
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

export type StripeLineItems = Stripe.Checkout.SessionCreateParams.LineItem[];

export type options = {
  customer: Stripe.CustomerCreateParams;
  line_items: StripeLineItems;
};

export interface RecommendedBooks {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
}

export interface AggregationResult {
  _id: ObjectId;
  title: string;
  genre: string;
  price: {
    mrp: number;
    sale: number;
    _id: ObjectId;
  };
  cover?: {
    url: string;
    id: string;
    _id: ObjectId;
  };
  slug: string;
  averageRatings?: number;
}

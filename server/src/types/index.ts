import {
  newAuthorSchema,
  newBookSchema,
} from "@/middlewares/validate-middleware";
import { RequestHandler } from "express";
import { z } from "zod";

type AuthorHandlerBody = z.infer<typeof newAuthorSchema>;
type NewBookBody = z.infer<typeof newBookSchema>;

// type CustomRequestHandler<T> =

export type RequestAuthorHandler = RequestHandler<{}, {}, AuthorHandlerBody>;

export type CreateBookRequestHandler = RequestHandler<{}, {}, NewBookBody>;

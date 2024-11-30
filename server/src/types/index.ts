import { newAuthorSchema } from "@/middlewares/validate-middleware";
import { RequestHandler } from "express";
import { z } from "zod";

type AuthorHandlerBody = z.infer<typeof newAuthorSchema>;

// type CustomRequestHandler<T> =

export type RequestAuthorHandler = RequestHandler<{}, {}, AuthorHandlerBody>;

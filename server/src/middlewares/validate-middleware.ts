import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodObject, ZodRawShape } from "zod";

export const validate = <T extends ZodRawShape>(obj: T): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object(obj);
    const result = schema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
      next();
    } else {
      const errors = result.error.flatten().fieldErrors;
      res.status(422).json({ success: false, errors });
    }
  };
};

// VALIDATORS
export const emailValidationSchema = {
  email: z
    .string({
      required_error: "Email is missing",
      invalid_type_error: "Invalid email type",
    })
    .email("Invalid email"),
};

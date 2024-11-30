import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodObject, ZodRawShape, ZodType } from "zod";

export const validate = <T extends unknown>(
  schema: ZodType<T>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // const schema = z.object(obj);
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
export const emailValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is missing",
      invalid_type_error: "Invalid email type",
    })
    .email("Invalid email"),
});

export const newUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing",
      invalid_type_error: "Invalid name",
    })
    .min(3, "Name must be 3 characters long!")
    .trim(),
});

export const newAuthorSchema = z.object({
  name: z
    .string({
      required_error: "Name is missing",
      invalid_type_error: "Invalid name",
    })
    .min(3, "Name must be 3 characters long!")
    .trim(),
  about: z
    .string({
      required_error: "About is missing",
      invalid_type_error: "Invalid about",
    })
    .min(10, "About must be 10 characters long!")
    .trim(),
  socialLinks: z
    .array(z.string().url("Social links can only be list of valid URLs!"))
    .optional(),
});

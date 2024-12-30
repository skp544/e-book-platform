import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodObject, ZodRawShape } from "zod";
import { isValidObjectId } from "mongoose";

export const validate = <T extends ZodRawShape>(
  schema: ZodObject<T>
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

export const commonBookSchema = {
  uploadMethod: z.enum(["aws", "local"], {
    required_error: "Please define a valid upload method",
    message: "Invalid upload method needs to be either aws or local",
  }),
  title: z
    .string({
      required_error: "Title is missing",
      invalid_type_error: "Invalid title",
    })
    .trim(),
  description: z
    .string({
      required_error: "Description is missing",
      invalid_type_error: "Invalid description",
    })
    .trim(),
  language: z
    .string({
      required_error: "Language is missing",
      invalid_type_error: "Invalid language",
    })
    .trim(),
  publishedAt: z.coerce.date({
    required_error: "Publish date is missing",
    invalid_type_error: "Invalid publish date",
  }),
  publicationName: z
    .string({
      required_error: "Publication name is missing",
      invalid_type_error: "Invalid publication name",
    })
    .trim(),
  genre: z
    .string({
      required_error: "Genre is missing",
      invalid_type_error: "Invalid genre",
    })
    .trim(),
  price: z
    .string({
      required_error: "Price is missing",
      invalid_type_error: "Invalid price",
    })
    .transform((value, ctx) => {
      try {
        return JSON.parse(value);
      } catch (error) {
        ctx.addIssue({ code: "custom", message: "Invalid Price Data" });
        return z.NEVER;
      }
    })
    .pipe(
      z.object({
        mrp: z
          .number({
            required_error: "MRP is missing",
            invalid_type_error: "Invalid MRP",
          })
          .nonnegative("Invalid mrp!"),
        sale: z
          .number({
            required_error: "Sale price is missing",
            invalid_type_error: "Invalid Sale price",
          })
          .nonnegative("Invalid sale price!"),
      })
    )
    .refine(
      (price) => price.sale < price.mrp,
      "Sale price should be less than MRP!"
    ),
};

export const fileInfo = z
  .string({
    required_error: "File info is missing",
    invalid_type_error: "Invalid file info",
  })
  .transform((value, ctx) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      ctx.addIssue({ code: "custom", message: "Invalid File Info" });
      return z.NEVER;
    }
  })
  .pipe(
    z.object({
      name: z
        .string({
          required_error: "fileInfo.name is missing",
          invalid_type_error: "Invalid fileInfo.name",
        })
        .trim(),
      type: z
        .string({
          required_error: "fileInfo.type is missing!",
          invalid_type_error: "Invalid fileInfo.type!",
        })
        .trim(),
      size: z
        .number({
          required_error: "fileInfo.size is missing",
          invalid_type_error: "Invalid fileInfo.size price",
        })
        .nonnegative("Invalid fileInfo.size price!"),
    })
  );

export const newBookSchema = z.object({
  ...commonBookSchema,
  fileInfo,
});

export const updateBookSchema = z.object({
  ...commonBookSchema,
  slug: z
    .string({
      message: "Invalid Slug!",
    })
    .trim(),
  fileInfo: fileInfo.optional(),
});

export const newReviewSchema = z.object({
  rating: z
    .number({
      required_error: "Rating is missing!",
      invalid_type_error: "Invalid rating!",
    })
    .nonnegative("Rating must be within 1 to 5.")
    .min(1, "Minimum rating should be 1")
    .max(5, "Maximum rating should be 5"),
  content: z
    .string({
      invalid_type_error: "Invalid rating!",
    })
    .optional(),
  bookId: z
    .string({
      required_error: "Book id is missing!",
      invalid_type_error: "Invalid book id!",
    })
    .transform((arg, ctx) => {
      console.log("arg", arg);
      console.log("arg", !isValidObjectId(arg));
      if (!isValidObjectId(arg)) {
        ctx.addIssue({ code: "custom", message: "Invalid book id!" });
        return z.NEVER;
      }
      console.log(arg, "ssss");
      return arg;
    }),
});

export const historyValidationSchema = z.object({
  bookId: z
    .string({
      required_error: "Book id is missing!",
      invalid_type_error: "Invalid book id!",
    })
    .transform((arg, ctx) => {
      console.log("arg", arg);
      console.log("arg", !isValidObjectId(arg));
      if (!isValidObjectId(arg)) {
        ctx.addIssue({ code: "custom", message: "Invalid book id!" });
        return z.NEVER;
      }
      console.log(arg, "ssss");
      return arg;
    }),
  lastLocation: z
    .string({
      invalid_type_error: "Invalid Last Location!",
    })
    .trim()
    .optional(),

  highlights: z
    .array(
      z.object({
        selection: z
          .string({
            required_error: "Highlight selection is missing",
            invalid_type_error: "Invalid Highlight selection!",
          })
          .trim(),
        fill: z
          .string({
            required_error: "Highlight fill is missing",
            invalid_type_error: "Invalid Highlight fill!",
          })
          .trim(),
      })
    )
    .optional(),
  remove: z.boolean({
    invalid_type_error: "Remove must be a boolean value",
    required_error: "Remove is missing!",
  }),
});

export const cartItemsSchema = z.object({
  items: z.array(
    z.object({
      product: z
        .string({
          required_error: "Product id is missing!",
          invalid_type_error: "Invalid product id!",
        })
        .transform((arg, ctx) => {
          if (!isValidObjectId(arg)) {
            ctx.addIssue({ code: "custom", message: "Invalid product id!" });
            return z.NEVER;
          }

          return arg;
        }),
      quantity: z.number({
        required_error: "Quantity is missing!",
        invalid_type_error: "Quantity must be number!",
      }),
    })
  ),
});

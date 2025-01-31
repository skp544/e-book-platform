import Author from "@/models/author-model";
import { BookDoc } from "@/models/book-model";
import User from "@/models/user-model";
import { RequestAuthorHandler } from "@/types";
import { sendErrorResponse } from "@/utils/helper";
import { Request, RequestHandler, Response } from "express";
import slugify from "slugify";

export const registerAuthor: RequestAuthorHandler = async (
  req: Request,
  res: Response
) => {
  const { body, user } = req;

  if (!user.signedUp) {
    return sendErrorResponse({
      message: "User must be signed up before registering as author!",
      status: 401,
      res,
    });
  }

  const newAuthor = new Author({
    name: body.name,
    about: body.about,
    userId: user.id,
    socialLinks: body.socialLinks,
  });

  const uniqueSlug = slugify(`${newAuthor.name} ${newAuthor._id}`, {
    lower: true,
    replacement: "-",
  });

  newAuthor.slug = uniqueSlug;
  await newAuthor.save();

  await User.findByIdAndUpdate(user.id, {
    authorId: newAuthor._id,
    role: "author",
  });

  res.json({ success: true, message: "Thanks for registering as an author!" });
};

export const getAuthorDetails: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const author = await Author.findOne({ _id: id }).populate<{
    books: BookDoc[];
  }>("books");

  if (!author) {
    return sendErrorResponse({
      message: "Author not found!",
      status: 404,
      res,
    });
  }

  res.json({
    data: {
      id: author._id,
      name: author.name,
      about: author.about,
      socialLinks: author.socialLinks,
      books: author.books?.map((book) => {
        return {
          id: book._id?.toString(),
          title: book.title,
          slug: book.slug,
          genre: book.genre,
          price: {
            mrp: (book.price.mrp / 100).toFixed(2),
            sale: (book.price.sale / 100).toFixed(2),
          },
          cover: book.cover?.url,
          rating: book.averageRating?.toFixed(1),
        };
      }),
    },
    success: true,
  });
};

export const updateAuthor: RequestAuthorHandler = async (
  req: Request,
  res: Response
) => {
  const { body, user } = req;

  const author = await Author.findByIdAndUpdate(user.authorId, {
    name: body.name,
    about: body.about,
    socialLinks: body.socialLinks,
  });

  res.json({ message: "Your details updated successfully!", success: true });
};

import { handleError, sendErrorResponse } from "@/utils/helper";
import { RequestAuthorHandler } from "@/types";
import AuthorModel from "@/models/author-model";
import slugify from "slugify";
import UserModel from "@/models/user-model";
import { RequestHandler, Response, Request } from "express";
import { BookDoc } from "@/models/book-model";

export const registerAuthor: RequestAuthorHandler = async (req, res) => {
  try {
    const { body, user } = req;

    if (!user.signedUp) {
      return sendErrorResponse({
        res,
        status: 401,
        message: "User must be signed up before registering as author!",
      });
    }

    const existingAuthor = await AuthorModel.findOne({ userId: user.id });
    if (existingAuthor) {
      return sendErrorResponse({
        res,
        status: 400,
        message: "You are already registered as author!",
      });
    }

    const newAuthor = new AuthorModel({
      name: body.name,
      about: body.about,
      userId: user.id,
      socialLinks: body.socialLinks,
    });

    newAuthor.slug = slugify(`${newAuthor.name} ${newAuthor._id}`, {
      lower: true,
      replacement: "-",
    });

    await newAuthor.save();

    await UserModel.findByIdAndUpdate(user.id, {
      authorId: newAuthor._id,
      role: "author",
    });

    res.status(201).json({
      success: true,
      message: "Thanks for registering as author!",
    });
  } catch (e) {
    handleError(e, res);
  }
};

export const getAuthorDetails: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const author = await AuthorModel.findOne({ _id: id }).populate<{
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

export const updateAuthor: RequestAuthorHandler = async (req, res) => {
  try {
    const { body, user } = req;

    const author = await AuthorModel.findByIdAndUpdate(user.authorId, {
      name: body.name,
      about: body.about,
      socialLinks: body.socialLinks,
    });
    res.json({ message: "Your details updated successfully!", success: true });
  } catch (e) {
    handleError(e, res);
  }
};

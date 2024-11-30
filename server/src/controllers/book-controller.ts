import Book, { BookDoc } from "@/models/book-model";
import { CreateBookRequestHandler } from "@/types";
import { uploadCoverToCloudinary } from "@/utils/fileUploader";
import { formatFileSize, sendErrorResponse } from "@/utils/helper";
import { Request, Response } from "express";
import { Types } from "mongoose";
import slugify from "slugify";
import fs from "fs";
import path from "path";

export const createNewBook: CreateBookRequestHandler = async (
  req: Request,
  res: Response
) => {
  const { body, files, user } = req;

  const {
    title,
    description,
    genre,
    language,
    fileInfo,
    price,
    publicationName,
    publishedAt,
  } = body;

  const { cover, book } = files;

  const newBook = new Book<BookDoc>({
    title,
    description,
    genre,
    language,
    fileInfo: { size: formatFileSize(fileInfo.size), id: "" },
    price,
    publicationName,
    publishedAt,
    slug: "",
    author: new Types.ObjectId(user.authorId),
  });

  newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
    lower: true,
    replacement: "-",
  });

  if (cover && !Array.isArray(cover)) {
    // cloudinary upload logic
    newBook.cover = await uploadCoverToCloudinary(cover);

    // http

    if (!book || Array.isArray(book)) {
      return sendErrorResponse({
        res,
        status: 422,
        message: "Invalid book file",
      });
    }

    const bookStoragePath = path.join(__dirname, "../books");

    if (!fs.existsSync(bookStoragePath)) {
      fs.mkdirSync(bookStoragePath);
    }

    const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
      lower: true,
      replacement: "-",
    });

    const filePath = path.join(uniqueFileName);

    fs.writeFileSync(filePath, fs.readFileSync(book.filepath));
  }

  await newBook.save();
};

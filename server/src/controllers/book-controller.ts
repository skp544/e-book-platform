import Book, { BookDoc } from "@/models/book-model";
import { CreateBookRequestHandler } from "@/types";
import {
  uploadBookToLocalDir,
  uploadCoverToCloudinary,
} from "@/utils/fileUploader";
import { formatFileSize, sendErrorResponse } from "@/utils/helper";
import { Request, Response } from "express";
import { Types } from "mongoose";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import Author from "@/models/author-model";

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
  }

  console.log(book);

  if (
    !book ||
    Array.isArray(book) ||
    book.mimetype !== "application/epub+zip"
  ) {
    return sendErrorResponse({
      res,
      status: 422,
      message: "Invalid book file",
    });
  }

  const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
    lower: true,
    replacement: "-",
  });

  await uploadBookToLocalDir(book, uniqueFileName);

  newBook.fileInfo.id = uniqueFileName;

  await Author.findByIdAndUpdate(user.authorId, {
    $push: { books: newBook._id },
  });

  await newBook.save();

  res.status(200).json({
    success: true,
    message: "Book created successfully",
  });
};

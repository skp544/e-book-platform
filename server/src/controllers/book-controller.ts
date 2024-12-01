import Book, { BookDoc } from "@/models/book-model";
import { CreateBookRequestHandler } from "@/types";
import {
  generateFileUploadUrl,
  uploadBookToAWS,
  uploadBookToLocalDir,
  uploadCoverToCloudinary,
} from "@/utils/fileUploader";
import { formatFileSize, sendErrorResponse } from "@/utils/helper";
import { Request, Response } from "express";
import { Types } from "mongoose";
import slugify from "slugify";
import Author from "@/models/author-model";
import s3Client from "@/cloud/aws";

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
    uploadMethod,
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

  let fileUploadUrl = "";

  newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
    lower: true,
    replacement: "-",
  });

  // File name
  const fileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
    lower: true,
    replacement: "-",
  });

  // Local
  if (uploadMethod === "local") {
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

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      newBook.cover = await uploadCoverToCloudinary(cover);
    }

    await uploadBookToLocalDir(book, fileName);
  }

  // AWS
  if (uploadMethod === "aws") {
    fileUploadUrl = await generateFileUploadUrl(s3Client, {
      bucket: process.env.AWS_PRIVATE_BUCKET!,
      contentType: fileInfo.type,
      uniqueKey: fileName,
    });

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.png`, {
        lower: true,
        replacement: "-",
      });

      newBook.cover = await uploadBookToAWS(cover.filepath, uniqueFileName);
    }
  }

  newBook.fileInfo.id = fileName;
  await Author.findByIdAndUpdate(user.authorId, {
    $push: { books: newBook._id },
  });

  await newBook.save();

  res.status(200).json({
    success: true,
    message: "Book created successfully",
  });
};

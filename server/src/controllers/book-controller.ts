import Book, { BookDoc } from "@/models/book-model";
import { CreateBookRequestHandler, UpdateBookRequestHandler } from "@/types";
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
import path from "path";
import fs from "fs";
import cloudinary from "@/cloud/cloudinary";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

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

export const updateBook: UpdateBookRequestHandler = async (
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
    slug,
  } = body;

  const { cover, book: newBookFile } = files;

  const book = await Book.findOne({
    slug,
    author: user.authorId,
  });

  if (!book) {
    return sendErrorResponse({
      res,
      status: 404,
      message: "Book not found",
    });
  }

  book.title = title;
  book.description = description;
  book.genre = genre;
  book.language = language;
  book.publicationName = publicationName;
  book.genre = genre;
  book.publishedAt = publishedAt;
  book.price = price;

  if (uploadMethod === "local") {
    if (
      newBookFile &&
      !Array.isArray(newBookFile) &&
      newBookFile.mimetype === "application/epub+zip"
    ) {
      // remove old file from local storage
      const uploadPath = path.join(__dirname, "../books");

      const oldFilePath = path.join(uploadPath, book.fileInfo.id);

      if (fs.existsSync(oldFilePath)) {
        return sendErrorResponse({
          res,
          status: 404,
          message: "Book file not found",
        });
      }

      fs.unlinkSync(oldFilePath);

      // add new book to the storage

      const newFileName = slugify(`${book._id} ${book.title}`, {
        lower: true,
        replacement: "-",
      });

      const newFilePath = path.join(uploadPath, newFileName);

      const file = fs.readFileSync(newBookFile.filepath);
      fs.writeFileSync(newFilePath, file);

      book.fileInfo = {
        id: newFileName,
        size: formatFileSize(fileInfo.size || newBookFile.size),
      };
    }

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      // remove old cover file if exists
      if (book.cover?.id) {
        await cloudinary.uploader.destroy(book.cover.id);
      }
      book.cover = await uploadCoverToCloudinary(cover);
    }
  }

  let fileUploadUrl = "";
  if (uploadMethod === "aws") {
    if (
      newBookFile &&
      !Array.isArray(newBookFile) &&
      newBookFile.mimetype === "application/epub+zip"
    ) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_PRIVATE_BUCKET!,
        Key: book.fileInfo.id,
      });

      await s3Client.send(deleteCommand);

      const fileName = slugify(`${book._id} ${book.title}.epub`, {
        lower: true,
        replacement: "-",
      });

      fileUploadUrl = await generateFileUploadUrl(s3Client, {
        bucket: process.env.AWS_PRIVATE_BUCKET!,
        contentType: fileInfo?.type || newBookFile.mimetype,
        uniqueKey: fileName,
      });
    }

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      if (book.cover?.id) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: book.cover.id,
        });

        await s3Client.send(deleteCommand);
      }

      const uniqueFileName = slugify(`${book._id} ${book.title}.png`, {
        lower: true,
        replacement: "-",
      });

      book.cover = await uploadBookToAWS(cover.filepath, uniqueFileName);
    }
  }

  await book.save();

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
  });
};

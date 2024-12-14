import Book, { BookDoc } from "@/models/book-model";
import {
  AggregationResult,
  CreateBookRequestHandler,
  PopulatedBooks, RecommendedBooks,
  Settings,
  UpdateBookRequestHandler,
} from "@/types";
import {
  generateFileUploadUrl,
  uploadBookToAWS,
  uploadBookToLocalDir,
  uploadCoverToCloudinary,
} from "@/utils/fileUploader";
import { formatFileSize, sendErrorResponse } from "@/utils/helper";
import { Request, RequestHandler, Response } from "express";
import { isValidObjectId, Types } from "mongoose";
import slugify from "slugify";
import Author from "@/models/author-model";
import s3Client from "@/cloud/aws";
import path from "path";
import fs from "fs";
import cloudinary from "@/cloud/cloudinary";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import User from "@/models/user-model";
import History from "@/models/history-model";
import * as process from "node:process";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export const getAllPurchasedBooks: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await User.findById(req.user.id).populate<{
    books: PopulatedBooks;
  }>({
    path: "books",
    select: "author title cover slug",
    populate: { path: "author", select: "slug name" },
  });

  if (!user) {
    res.json({ data: [] });
    return;
  }

  res.json({
    data: user?.books.map((book: PopulatedBooks) => ({
      id: book._id,
      title: book.title,
      cover: book.cover?.url,
      slug: book.slug,
      author: {
        name: book.author.name,
        slug: book.author.slug,
      },
    })),
  });
};

export const getBooksPublicDetails: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const book = await Book.findOne({ slug: req.params.slug }).populate<{
    author: PopulatedBooks["author"];
  }>({ path: "author", select: "name slug" });

  if (!book)
    return sendErrorResponse({ status: 404, message: "Book not found!", res });

  const {
    _id,
    title,
    cover,
    author,
    slug,
    description,
    genre,
    language,
    publicationName,
    publishedAt,
    price: { mrp, sale },
    fileInfo,
    averageRating,
  } = book;

  res.json({
    data: {
      id: _id,
      title,
      genre,
      language,
      slug,
      publicationName,
      publishedAt: publishedAt.toISOString().split("T")[0],
      description,
      cover: cover?.url,
      rating: averageRating?.toFixed(1),
      fileInfo: { size: fileInfo.size, key: fileInfo.id },
      price: {
        mrp: (mrp / 100).toFixed(2),
        sale: (sale / 100).toFixed(2),
      },
      author: {
        id: author._id,
        name: author.name,
        slug: author.slug,
      },
    },
  });
};

export const getBooksByGenre: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const books = await Book.find({ genre: req.params.genre }).limit(5);

  res.json({
    data: books.map((book) => {
      const {
        _id,
        title,
        cover,
        averageRating,
        slug,
        genre,
        price: { mrp, sale },
      } = book;
      return {
        id: _id,
        title,
        genre,
        slug,
        cover: cover?.url,
        rating: averageRating?.toFixed(1),
        price: {
          mrp: (mrp / 100).toFixed(2),
          sale: (sale / 100).toFixed(2),
        },
      };
    }),
  });
};

export const generateBookAccessUrl: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { slug } = req.params;

  const book = await Book.findOne({ slug });

  if (!book) {
    return sendErrorResponse({ status: 404, message: "Book not found", res });
  }

  const user = await User.findOne({ _id: req.user.id, books: book._id });

  if (!user) {
    return sendErrorResponse({
      status: 403,
      message: "Unauthorized access",
      res,
    });
  }

  const history = await History.findOne({
    reader: req.user.id,
    book: book._id,
  });

  const settings: Settings = {
    lastLocation: "",
    highlights: [],
  };

  if (history) {
    settings.highlights = history.highlights.map((h) => ({
      fill: h.fill,
      selection: h.selection,
    }));
    settings.lastLocation = history.lastLocation;
  }

  /*
  // FOR AWS
 const bookGetCommand =  new GetObjectCommand({Bucket: process.env.AWS_PRIVATE_BUCKET, Key: book.fileInfo.id})
  const accessUrl = await  getSignedUrl(s3Client, bookGetCommand)
   */

  // FOR LOCAL

  res.json({
    data: { settings, url: `${process.env.BOOK_API_URL}/${book.fileInfo.id}` },
  });
};

export const getRecommendedBooks: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId)) {
    return sendErrorResponse({ status: 422, message: "Book not found", res });
  }

  const book = await Book.findById(bookId);

  if (!book) {
    return sendErrorResponse({ status: 404, message: "Book not found", res });
  }

  const recommendedBooks = await Book.aggregate<AggregationResult>([
    { $match: { genre: book.genre, _id: { $ne: book._id } } },
    {
      $lookup: {
        localField: "_id",
        from: "reviews",
        foreignField: "book",
        as: "reviews",
      },
    },
    {
      $addFields: {
        averageRating: {
          $avg: "$reviews.rating",
        },
      },
    },
    {
      $sort: {
        averageRating: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        genre: 1,
        price: 1,
        cover: 1,
        averageRatings: 1,
      },
    },
  ]);

  const result = recommendedBooks.map<RecommendedBooks>((book) => ({
    id: book._id.toString(),
    title: book.title,
    slug: book.slug,
    genre: book.genre,
    price: {
      mrp: (book.price.mrp / 100).toFixed(2),
      sale: (book.price.sale / 100).toFixed(2),
    },
    cover: book.cover?.url,
    rating: book.averageRatings?.toFixed(1),
  }));

  res.json({data: result});
};

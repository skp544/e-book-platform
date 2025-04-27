import {
  formatFileSize,
  generateS3ClientPublicUrl,
  handleError,
  sendErrorResponse,
} from "@/utils/helper";
import {
  AggregationResult,
  CreateBookRequestHandler,
  PopulatedBooks,
  RecommendedBooks,
  Settings,
  UpdateBookRequestHandler,
} from "@/types";
import BookModel, { BookDoc } from "@/models/book-model";
import { isValidObjectId, Types } from "mongoose";
import slugify from "slugify";
import {
  generateFileUploadUrl,
  uploadBookCoverToAWS,
  uploadBookToLocalDir,
  uploadCoverToCloudinary,
} from "@/utils/file-upload";
import AuthorModel from "@/models/author-model";
import s3Client from "@/cloud/aws";
import path from "path";
import fs from "fs";
import cloudinary from "@/cloud/cloudinary";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { RequestHandler } from "express";
import UserModel from "@/models/user-model";
import HistoryModel from "@/models/history-model";
import { featuredBookData } from "@/utils/featured-books";

export const createNewBook: CreateBookRequestHandler = async (req, res) => {
  try {
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

    const newBook = new BookModel<BookDoc>({
      title,
      description,
      genre,
      language,
      fileInfo: {
        size: formatFileSize(fileInfo.size),
        id: "",
      },
      price,
      publicationName,
      publishedAt,
      slug: "",
      author: new Types.ObjectId(req.user.authorId),
    });

    newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
      lower: true,
      replacement: "-",
    });

    const fileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
      lower: true,
      replacement: "-",
    });

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

      if (
        cover &&
        !Array.isArray(cover) &&
        cover.mimetype?.startsWith("image")
      ) {
        newBook.cover = await uploadCoverToCloudinary(cover);
      }

      uploadBookToLocalDir(book, fileName);
    }

    if (uploadMethod === "aws") {
      const fileUploadUrl = await generateFileUploadUrl(s3Client, {
        bucket: process.env.AWS_PRIVATE_BUCKET_NAME!,
        contentType: fileInfo.type,
        uniqueKey: fileName,
      });

      if (
        cover &&
        !Array.isArray(cover) &&
        cover.mimetype?.startsWith("image")
      ) {
        const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.png`, {
          lower: true,
          replacement: "-",
        });

        newBook.cover = await uploadBookCoverToAWS(
          cover.filepath,
          uniqueFileName
        );
      }
    }

    newBook.fileInfo.id = fileName;

    await AuthorModel.findByIdAndUpdate(user.authorId, {
      $push: {
        books: newBook._id,
      },
    });

    await newBook.save();

    res.status(200).json({
      success: true,
      message:
        "Congratulations! Your book has been published. It may `take a few minutes to reflect the changes.",
    });
  } catch (e) {
    handleError(e, res);
  }
};

export const updateBook: UpdateBookRequestHandler = async (req, res) => {
  try {
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

    const book = await BookModel.findOne({ slug, author: user.authorId });

    if (!book) {
      return sendErrorResponse({
        res,
        status: 404,
        message: "Book not found!",
      });
    }

    book.title = title || book.title;
    book.description = description || book.description;
    book.genre = genre || book.genre;
    book.language = language || book.language;
    book.price = price || book.price;
    book.publicationName = publicationName || book.publicationName;
    book.publishedAt = publishedAt || book.publishedAt;

    if (uploadMethod === "local") {
      if (
        newBookFile &&
        !Array.isArray(newBookFile) &&
        newBookFile.mimetype?.startsWith("application/epub+zip")
      ) {
        // remove old book file
        const uploadPath = path.join(__dirname, "../books");
        const oldFilePath = path.join(uploadPath, book.fileInfo.id);

        if (!fs.existsSync(oldFilePath)) {
          return sendErrorResponse({
            res,
            status: 404,
            message: "Book file not found!",
          });
        }

        fs.unlinkSync(oldFilePath);

        // add new book file

        const newFileName = slugify(`${book._id} ${book.title}.epub`, {
          lower: true,
          replacement: "-",
        });

        uploadBookToLocalDir(newBookFile, newFileName);
        book.fileInfo.id = newFileName;
      }

      if (
        cover &&
        !Array.isArray(cover) &&
        cover.mimetype?.startsWith("image")
      ) {
        if (book.cover?.id) {
          await cloudinary.uploader.destroy(book.cover?.id);
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

      if (
        cover &&
        !Array.isArray(cover) &&
        cover.mimetype?.startsWith("image")
      ) {
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

        book.cover = await uploadBookCoverToAWS(cover.filepath, uniqueFileName);
      }
    }

    book.slug = slugify(`${book.title} ${book._id}`, {
      lower: true,
      replacement: "-",
    });

    await book.save();
    res.status(200).json({
      success: true,
      message: "Book updated successfully!",
    });
  } catch (e) {
    handleError(e, res);
  }
};

export const getAllPurchasedBooks: RequestHandler = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate<{
      books: PopulatedBooks;
    }>({
      path: "books",
      select: "author title cover slug",
      populate: { path: "author", select: "slug name" },
    });

    if (!user) {
      return sendErrorResponse({
        res,
        status: 404,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
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
  } catch (e) {
    handleError(e, res);
  }
};

export const getBooksPublicDetails: RequestHandler = async (req, res) => {
  try {
    const book = await BookModel.findOne({ slug: req.params.slug }).populate<{
      author: PopulatedBooks["author"];
    }>({
      path: "author",
      select: "name slug",
    });

    if (!book) {
      return sendErrorResponse({
        res,
        status: 404,
        message: "Book not found!",
      });
    }

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
      success: true,
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
  } catch (e) {
    handleError(e, res);
  }
};

export const getBooksByGenre: RequestHandler = async (req, res) => {
  try {
    const books = await BookModel.find({ genre: req.params.genre }).limit(5);

    res.status(200).json({
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
      success: true,
    });
  } catch (e) {
    handleError(e, res);
  }
};

export const generateBookAccessUrl: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const book = await BookModel.findOne({ slug });

    if (!book) {
      return sendErrorResponse({ status: 404, message: "Book not found", res });
    }

    const user = await UserModel.findOne({ _id: req.user.id, books: book._id });

    if (!user) {
      return sendErrorResponse({
        status: 403,
        message: "Unauthorized access",
        res,
      });
    }

    const history = await HistoryModel.findOne({
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

    res.json({
      success: true,
      data: {
        settings,
        url: `${process.env.BOOK_API_URL}/${book.fileInfo.id}`,
      },
    });
  } catch (e) {
    handleError(e, res);
  }
};

export const getRecommendedBooks: RequestHandler = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!isValidObjectId(bookId)) {
      return sendErrorResponse({ status: 422, message: "Book not found", res });
    }

    const book = await BookModel.findById(bookId);

    if (!book) {
      return sendErrorResponse({ status: 404, message: "Book not found", res });
    }

    const recommendedBooks = await BookModel.aggregate<AggregationResult>([
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

    res.status(200).json({ success: true, data: result });
  } catch (e) {
    handleError(e, res);
  }
};

export const getAllBooks: RequestHandler = async (req, res) => {
  const books = await BookModel.find();

  res.status(200).json({ success: true, data: books });
};

export const getFeaturedBooks: RequestHandler = async (req, res) => {
  const books = await BookModel.find();

  const data = books.slice(0, 4).map((book, i) => {
    const { title, cover, slug, genre } = book;
    return {
      title,
      genre,
      slug,
      cover: cover?.url,
      slogan: featuredBookData[i].slogan,
    };
  });

  res.status(200).json({ success: true, data });
};

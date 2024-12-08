import { Response, Request, RequestHandler } from "express";
import { AddReviewRequestHandler } from "@/types";
import Review from "@/models/review-model";
import { sendErrorResponse } from "@/utils/helper";
import { isValidObjectId, Types } from "mongoose";
import Book from "@/models/book-model";

export const addReview: AddReviewRequestHandler = async (
  req: Request,
  res: Response
) => {
  const { bookId, rating, content } = req.body;

  await Review.findOneAndUpdate(
    { book: bookId, user: req.user.id },
    { content, rating },
    { upsert: true }
  );

  const [result] = await Review.aggregate<{ averageRating: number }>([
    {
      $match: {
        book: new Types.ObjectId(bookId),
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  await Book.findByIdAndUpdate(bookId, {
    averageRating: result.averageRating,
  });

  res.json({
    message: "Review updated.",
  });
};

export const getReview: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId))
    return sendErrorResponse({
      res,
      message: "Book id is not valid!",
      status: 422,
    });

  const review = await Review.findOne({
    book: bookId,
    user: req.user.id,
  });

  if (!review) {
    return sendErrorResponse({
      res,
      status: 404,
      message: "Review not found!+",
    });
  }

  res.json({
    content: review.content,
    rating: review.rating,
  });
};

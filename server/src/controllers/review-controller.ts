import { Response, Request, RequestHandler } from "express";
import { AddReviewRequestHandler, PopulatedUser } from "@/types";
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
    success: true,
    message: "Thanks for leaving a review.",
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
    res.status(200).json({
      success: true,
      message: "",
    });
    return;
  }

  res.json({
    success: true,
    data: {
      content: review.content,
      rating: review.rating,
    },
  });
};

export const getPublicReviews: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reviews = await Review.find({ book: req.params.bookId }).populate<{
    user: PopulatedUser;
  }>({ path: "user", select: "name avatar " });

  res.json({
    data: reviews.map((r) => {
      return {
        id: r._id,
        content: r.content,
        date: r.createdAt.toISOString().split("T")[0],
        rating: r.rating,
        user: {
          id: r.user._id,
          name: r.user.name,
          avatar: r.user.avatar,
        },
      };
    }),
  });
};

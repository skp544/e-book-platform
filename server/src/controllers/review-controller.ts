import { handleError, sendErrorResponse } from "@/utils/helper";
import { AddReviewRequestHandler, PopulatedUser } from "@/types";
import ReviewModel from "@/models/review-model";
import { RequestHandler } from "express";
import { isValidObjectId, Types } from "mongoose";
import BookModel from "@/models/book-model";

export const addReview: AddReviewRequestHandler = async (req, res) => {
  try {
    const { rating, content, bookId } = req.body;

    await ReviewModel.findOneAndUpdate(
      { book: bookId, user: req.user.id },
      {
        content,
        rating,
      },
      { upsert: true, new: true }
    );

    const [result] = await ReviewModel.aggregate<{ averageRating: number }>([
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

    await BookModel.findByIdAndUpdate(bookId, {
      averageRating: result.averageRating,
    });

    res.status(201).json({
      success: true,
      message: "Thanks for leaving a review!",
    });
  } catch (e) {
    handleError(e, res);
  }
};

export const getReview: RequestHandler = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!isValidObjectId(bookId)) {
      return sendErrorResponse({
        status: 400,
        message: "Invalid book id!",
        res,
      });
    }

    const review = await ReviewModel.findOne({
      book: bookId,
      user: req.user.id,
    });

    if (!review) {
      return res.status(200).json({
        success: true,
        message: "Review not found!",
        data: {
          content: "",
          rating: "",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        content: review.content,
        rating: review.rating,
      },
    });
  } catch (e) {
    handleError(e, res);
  }
};

export const getPublicReviews: RequestHandler = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({
      book: req.params.bookId,
    }).populate<{
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
  } catch (e) {
    handleError(e, res);
  }
};

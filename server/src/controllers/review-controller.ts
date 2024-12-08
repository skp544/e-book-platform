import { Response, Request} from "express";
import {AddReviewRequestHandler} from "@/types";
import  Review from "@/models/review-model"

export const addReview: AddReviewRequestHandler = async (req: Request, res: Response) => {
    const { bookId, rating, content } = req.body;

    await Review.findOneAndUpdate(
        { book: bookId, user: req.user.id },
        { content, rating },
        { upsert: true }
    );

    res.json({
        message: "Review added.",
    });
};
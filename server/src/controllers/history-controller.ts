import { UpdateHistoryRequestHandler } from "@/types";
import { handleError, sendErrorResponse } from "@/utils/helper";
import HistoryModel from "@/models/history-model";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const updateBookHistory: UpdateHistoryRequestHandler = async (
  req,
  res,
) => {
  try {
    const { bookId, highlights, lastLocation, remove } = req.body;

    let history = await HistoryModel.findOne({
      book: bookId,
      reader: req.user.id,
    });

    if (!history) {
      history = new HistoryModel({
        reader: req.user.id,
        book: bookId,
        lastLocation,
        highlights,
      });
    } else {
      if (lastLocation) history.lastLocation = lastLocation;
      if (highlights?.length && !remove) history.highlights.push(...highlights);

      if (highlights?.length && remove) {
        history.highlights = history.highlights.filter(
          (item) =>
            !highlights.find(
              (h: { selection: string; fill: string }) =>
                h.selection === item.selection,
            ),
        );
      }
    }

    await history.save();

    res.status(200).json({
      success: true,
      message: "History updated successfully!",
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getBookHistory: RequestHandler = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!isValidObjectId(bookId)) {
      return sendErrorResponse({
        res,
        message: "Invalid book id",
        statusCode: 422,
      });
    }

    const history = await HistoryModel.findOne({
      book: bookId,
      reader: req.user.id,
    });

    if (!history) {
      return sendErrorResponse({
        res,
        message: "History not found",
        status: 404,
      });
    }

    const formattedHistory = {
      lastLocation: history.lastLocation,
      highlights: history.highlights.map((highlight) => ({
        selection: highlight.selection,
        fill: highlight.fill,
      })),
    };

    res.status(200).json({
      success: true,
      data: formattedHistory,
    });
  } catch (error) {
    handleError(error, res);
  }
};

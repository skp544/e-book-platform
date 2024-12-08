import { Response, Request, RequestHandler } from "express";
import { UpdateHistoryRequestHandler } from "@/types";
import History from "@/models/history-model";
import { isValidObjectId } from "mongoose";
import { sendErrorResponse } from "@/utils/helper";

export const updateBookHistory: UpdateHistoryRequestHandler = async (
  req: Request,
  res: Response
) => {
  const { bookId, highlights, lastLocation, remove } = req.body;

  let history = await History.findOne({ book: bookId, reader: req.user.id });

  if (!history) {
    history = new History({
      reader: req.user.id,
      book: bookId,
      lastLocation,
      highlights,
    });
  } else {
    if (lastLocation) history.lastLocation = lastLocation;
    if (highlights?.length && !remove) history.highlights.push(...highlights);

    if (highlights?.length && remove) {
      // history.highlights = history.highlights.filter((item) => {
      //   const highlight = highlights.find((h) => {
      //     if (h.selection === item.selection) {
      //       return h;
      //     }
      //   });
      //
      //   if (!highlight) return true;
      // });
      history.highlights = history.highlights.filter(
        (item) =>
          !highlights.find(
            (h: { selection: string; fill: string }) =>
              h.selection === item.selection
          )
      );
    }
  }

  await history.save();

  res.send();
};

export const getBookHistory: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId))
    return sendErrorResponse({ res, message: "Invalid book Id!", status: 422 });

  const history = await History.findOne({ book: bookId, reader: req.user.id });

  if (!history)
    return sendErrorResponse({
      res,
      message: "No history found!",
      status: 404,
    });

  res.json({
    history: {
      lastLocation: history.lastLocation,
      highlights: history.highlights.map((h) => ({
        fill: h.fill,
        selection: h.selection,
      })),
    },
  });
};

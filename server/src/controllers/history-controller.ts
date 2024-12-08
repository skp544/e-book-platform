import { Response, Request } from "express";
import { UpdateHistoryRequestHandler } from "@/types";
import History from "@/models/history-model";

export const updateBookHistory: UpdateHistoryRequestHandler = async (
  req: Request,
  res: Response
) => {
  const { bookId, highlights, lastLocation } = req.body;

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
    if (highlights?.length) history.highlights.push(...highlights);
  }

  await history.save();

  res.send();
};

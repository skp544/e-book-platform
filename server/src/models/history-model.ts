import { Model, model, ObjectId, Schema } from "mongoose";
import { Settings } from "@/types";

export interface HistoryDoc extends Settings {
  book: ObjectId;
  reader: ObjectId;
}

const historySchema = new Schema<HistoryDoc>(
  {
    book: {
      type: Schema.ObjectId,
      ref: "Book",
      required: true,
    },
    reader: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    lastLocation: String,
    highlights: [
      {
        selection: String,
        fill: String,
      },
    ],
  },
  { timestamps: true },
);

const HistoryModel = model("History", historySchema);

export default HistoryModel as Model<HistoryDoc>;

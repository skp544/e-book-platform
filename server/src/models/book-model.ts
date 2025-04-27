import { Model, model, ObjectId, Schema, Types } from "mongoose";

export interface BookDoc {
  _id?: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  language: string;
  publishedAt: Date;
  publicationName: string;
  genre: string;
  price: {
    mrp: number;
    sale: number;
  };
  cover?: {
    id: string;
    url: string;
  };
  fileInfo: {
    id: string;
    size: string;
  };
  averageRating?: number;
}

const bookSchema = new Schema<BookDoc>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    publishedAt: {
      type: Date,
      required: true,
      trim: true,
    },
    publicationName: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Object,
      required: true,
      mrp: {
        type: Number,
        required: true,
      },
      sale: {
        type: Number,
        required: true,
      },
    },
    cover: {
      id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    fileInfo: {
      type: Object,
      required: true,
      id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

bookSchema.pre("save", function (next) {
  const { mrp, sale } = this.price;
  this.price = { mrp: mrp * 100, sale: sale * 100 };

  next();
});

const BookModel = model("Book", bookSchema);

export default BookModel as Model<BookDoc>;

import { Model, model, Schema, Types } from "mongoose";

export interface BookDoc {
  _id?: Types.ObjectId
  author: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  language: string;
  publishedAt: Date;
  publicationName: string;
  averageRating?: number;
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
}

const bookSchema = new Schema<BookDoc>({
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
    trim: true,
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
  publicationName: {
    type: String,
    required: true,
    trim: true,
  },
  averageRating:Number,
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  publishedAt: {
    type: Date,
    required: true,
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
    url: String,
    id: String,
  },
  fileInfo: {
    type: Object,
    required: true,
    url: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
});

bookSchema.pre("save", function (next){
  const {mrp, sale} = this.price
  this.price = {mrp: mrp * 100, sale: sale * 100}

  next()
})

const Book = model("Book", bookSchema);

export default Book as Model<BookDoc>;

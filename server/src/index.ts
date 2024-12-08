import "express-async-errors";
import express from "express";
import authRoutes from "./routes/auth-route";
import authorRoutes from "./routes/author-route";
import bookRoutes from "./routes/book-route";
import reviewRoutes from "./routes/review-route";
import "@/db/connect";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error-middleware";
import cookieParser from "cookie-parser";
import { fileParser } from "./middlewares/file-middleware";
import path from "path";
import formidable from "formidable";
import Review from "@/models/review-model";
import {Types} from "mongoose";


dotenv.config();

const app = express();

const publicPath = path.join(__dirname, "./books");
console.log(publicPath);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/books", express.static(publicPath));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/test", async (req, res) => {
  // console.log();
  const [result] = await  Review.aggregate<{averageRating: number}>([
    {
      $match: {
        book: new Types.ObjectId("6755845efa782256c1c8e52d")
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {$avg: "$rating"}
      }
    }
  ])

  const review = result.averageRating.toFixed(1)

  res.json({review});
});

app.use("/auth", authRoutes);
app.use("/author", authorRoutes);
app.use("/books", bookRoutes);
app.use("/review", reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
});

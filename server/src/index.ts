import "express-async-errors";
import express from "express";
import authRoutes from "./routes/auth-route";
import authorRoutes from "./routes/author-route";
import bookRoutes from "./routes/book-route";
import "@/db/connect";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error-middleware";
import cookieParser from "cookie-parser";
import { fileParser } from "./middlewares/file-middleware";
import path from "path";
import formidable from "formidable";

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

app.post("/test", async (req, res) => {
  // console.log();
  const form = formidable({
    uploadDir: path.join(__dirname, "./books"),
    filename(name, ext, part, form) {
      // console.log("name", name);
      // console.log("ext", ext);
      // console.log("part", part);
      // console.log("form", form);
      return name + ".jpg";
    },
  });
  await form.parse(req);
  res.json({});
});

app.use("/auth", authRoutes);
app.use("/author", authorRoutes);
app.use("/books", bookRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
});

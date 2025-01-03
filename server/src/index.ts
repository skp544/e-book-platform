import "express-async-errors";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth-route";
import authorRoutes from "./routes/author-route";
import bookRoutes from "./routes/book-route";
import reviewRoutes from "./routes/review-route";
import historyRoutes from "./routes/history-route";
import cartRoutes from "./routes/cart-route";
import checkoutRoutes from "@/routes/checkout-route";
import webhookRoutes from "./routes/webhook-route";
import orderRoutes from "./routes/order-route";
import "@/db/connect";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error-middleware";
import cookieParser from "cookie-parser";
import path from "path";
import { isAuth, isValidReadingRequest } from "@/middlewares/auth-middleware";

dotenv.config();

const app = express();

const publicPath = path.join(__dirname, "./books");
console.log(publicPath);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);
app.use("/webhook", webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/books", isAuth, isValidReadingRequest, express.static(publicPath));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/test", async (req, res) => {
  // console.log();

  res.json({});
});

app.use("/auth", authRoutes);
app.use("/author", authorRoutes);
app.use("/book", bookRoutes);
app.use("/review", reviewRoutes);
app.use("/history", historyRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/order", orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
});

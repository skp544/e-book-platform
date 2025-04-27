import "@/db/connect";
import express from "express";
import cors from "cors";
import authRoutes from "@/routes/auth-routes";
import authorRoutes from "@/routes/author-routes";
import errorHandler from "@/middlewares/error-middleware";
import cookieParser from "cookie-parser";
import bookRoutes from "@/routes/book-routes";
import path from "path";
import reviewRoutes from "@/routes/review-routes";
import historyRoutes from "@/routes/history-routes";
import { isAuth, isValidReadingRequest } from "@/middlewares/auth-middleware";
import cartRoutes from "@/routes/cart-routes";
import checkoutRoutes from "@/routes/checkout-routes";
import webhookRoutes from "@/routes/webhook-routes";
import orderRoutes from "@/routes/order-routes";

const app = express();

const publicPath = path.join(__dirname, "./books");
app.use("/webhook", webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use("/books", isAuth, isValidReadingRequest, express.static(publicPath));

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello to our app!!");
});

// routes
app.use("/auth", authRoutes);
app.use("/author", authorRoutes);
app.use("/book", bookRoutes);
app.use("/review", reviewRoutes);
app.use("/history", historyRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

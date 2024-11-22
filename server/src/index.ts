import "express-async-errors";
import express from "express";
import authRoutes from "./routes/auth-route";
import "@/db/connect";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error-middleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
});

import mongoose from "mongoose";

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/e-book";

if (!URI) {
  throw new Error("Please provide a MongoDB URI");
}

export const connectDB = async () => {
  await mongoose
    .connect(URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
    });
};

import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "author"],
    default: "user",
  },
});

const User = model("User", userSchema);

export default User;

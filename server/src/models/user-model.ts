import { ObjectId, model, Schema } from "mongoose";

export interface UserDoc {
  _id: ObjectId;
  name?: string;
  email: string;
  role: "user" | "author";
}

const userSchema = new Schema<UserDoc>({
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

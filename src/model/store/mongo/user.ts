import Mongoose from "mongoose";
import { User } from "../../interface/user";

const { Schema } = Mongoose;

const userSchema = new Schema<User>({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  aboutMe: { type: String, default: null },
  imageUrl: { type: String, default: null },
  role: {
    type: String,
    enum: ["default", "admin"],
    default: "default",
  },
});

export const UserModel = Mongoose.model("User", userSchema);

import Mongoose from "mongoose";
import { User } from "../../interface/user.js";
import { imageStore } from "../image-store.js";

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

// to delete the image stored on cloudinary
const deleteMiddleware = async function (next) {
  let users = [];

  if (this.getFilter) {
    users = await this.model.find(this.getFilter());
  }
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    if (user.imageUrl) {
      // eslint-disable-next-line no-await-in-loop
      await imageStore.deleteImage(user.imageUrl);
    }
  }
  next();
};

userSchema.pre("findOneAndDelete", deleteMiddleware);
userSchema.pre("deleteOne", deleteMiddleware);
userSchema.pre("deleteMany", deleteMiddleware);

export const UserModel = Mongoose.model("User", userSchema);

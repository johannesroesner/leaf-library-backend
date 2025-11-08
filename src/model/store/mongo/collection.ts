import Mongoose from "mongoose";
import { Collection } from "../../interface/collection.js";

const { Schema } = Mongoose;

const collectionSchema = new Schema<Collection>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: null },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  plantIds: [{ type: Schema.Types.ObjectId, ref: "Plant" }],
});

export const CollectionModel = Mongoose.model("Collection", collectionSchema);

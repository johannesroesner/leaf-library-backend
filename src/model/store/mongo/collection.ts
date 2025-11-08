import Mongoose from "mongoose";
import { Collection } from "../../interface/collection.js";
import { imageStore } from "../image-store.js";

const { Schema } = Mongoose;

const collectionSchema = new Schema<Collection>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: null },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  plantIds: [{ type: Schema.Types.ObjectId, ref: "Plant" }],
});

// to delete the image stored on cloudinary
const deleteMiddleware = async function (next) {
  let collections = [];

  if (this.getFilter) {
    collections = await this.model.find(this.getFilter());
  }
  for (let i = 0; i < collections.length; i += 1) {
    const collection = collections[i];
    if (collection.imageUrl) {
      // eslint-disable-next-line no-await-in-loop
      await imageStore.deleteImage(collection.imageUrl);
    }
  }
  next();
};

collectionSchema.pre("findOneAndDelete", deleteMiddleware);
collectionSchema.pre("deleteOne", deleteMiddleware);
collectionSchema.pre("deleteMany", deleteMiddleware);
export const CollectionModel = Mongoose.model("Collection", collectionSchema);

import Mongoose from "mongoose";
import { BiomeArray, Plant, PlantTypeArray } from "../../interface/plant.js";
import { imageStore } from "../image-store.js";

const { Schema } = Mongoose;

const plantSchema = new Schema<Plant>({
  commonName: { type: String, required: true },
  scientificName: { type: String, required: true },
  type: { type: String, enum: PlantTypeArray, required: true },
  biome: { type: String, enum: BiomeArray, required: true },
  imageUrls: { type: [String], default: [] },
  note: { type: String, default: null },
  date: { type: Date, default: Date.now },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// to delete the image stored on cloudinary
const deleteMiddleware = async function (next) {
  let plants = [];

  if (this.getFilter) {
    plants = await this.model.find(this.getFilter());
  }
  for (let i = 0; i < plants.length; i += 1) {
    const plant = plants[i];
    if (plant.imageUrls.length > 0) {
      for (let j = 0; j < plant.imageUrls.length; j += 1) {
        // eslint-disable-next-line no-await-in-loop
        await imageStore.deleteImage(plant.imageUrls[j]);
      }
    }
  }
  next();
};

plantSchema.pre("findOneAndDelete", deleteMiddleware);
plantSchema.pre("deleteOne", deleteMiddleware);
plantSchema.pre("deleteMany", deleteMiddleware);

export const PlantModel = Mongoose.model("Plant", plantSchema);

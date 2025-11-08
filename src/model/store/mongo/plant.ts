import Mongoose from "mongoose";
import { BiomeArray, Plant, PlantTypeArray } from "../../interface/plant.js";

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

export const PlantModel = Mongoose.model("Plant", plantSchema);

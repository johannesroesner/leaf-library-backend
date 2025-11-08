import Mongoose from "mongoose";
import { PlantStore } from "../../database.js";
import type { NewPlant, Plant } from "../../interface/plant.js";
import { PlantModel } from "./plant.js";
import type { User } from "../../interface/user.js";
import { UserModel } from "./user.js";
import { CollectionModel } from "./collection.js";

export const plantMongoStore: PlantStore = {
  async getAll(): Promise<Plant[]> {
    return PlantModel.find().lean();
  },

  async getById(plantId: Plant["_id"]): Promise<Plant | null> {
    if (!Mongoose.isValidObjectId(plantId)) return null;
    return PlantModel.findById(plantId).lean();
  },

  async getAllForUser(userId: User["_id"]): Promise<Plant[] | null> {
    if (!Mongoose.isValidObjectId(userId)) return null;
    const foundUser = await UserModel.findById(userId).lean();
    if (!foundUser) return null;

    return PlantModel.find({ userId: userId }).lean();
  },

  async createForUser(userId: User["_id"], newPlant: NewPlant): Promise<Plant | null> {
    if (!Mongoose.isValidObjectId(userId)) return null;
    const foundUser = await UserModel.findById(userId).lean();
    if (!foundUser) return null;

    newPlant = { ...newPlant, userId: userId, date: new Date() } as Plant;
    const plant = new PlantModel(newPlant);
    const plantObject = await plant.save();

    return PlantModel.findById(plantObject._id).lean();
  },

  async update(plant: Plant): Promise<Plant | null> {
    if (!Mongoose.isValidObjectId(plant._id)) return null;
    return PlantModel.findByIdAndUpdate(
      plant._id,
      {
        commonName: plant.commonName,
        scientificName: plant.scientificName,
        type: plant.type,
        biome: plant.biome,
        imageUrls: plant.imageUrls,
        note: plant.note,
        latitude: plant.latitude,
        longitude: plant.longitude,
      },
      { new: true }
    ).lean();
  },

  async deleteAll(): Promise<Plant[]> {
    const foundPlants = await PlantModel.find({}).lean();
    if (foundPlants.length === 0) return [];

    await PlantModel.deleteMany({});
    await CollectionModel.updateMany({}, { $set: { plantIds: [] } });

    return foundPlants;
  },

  async deleteById(plantId: Plant["_id"]): Promise<Plant | null> {
    if (!Mongoose.isValidObjectId(plantId)) return null;
    const foundPlant = await PlantModel.findById(plantId).lean();
    if (!foundPlant) return null;
    await PlantModel.deleteOne({ _id: plantId });
    await CollectionModel.updateMany({ plantIds: plantId }, { $pull: { plantIds: plantId } });
    return foundPlant;
  },
};

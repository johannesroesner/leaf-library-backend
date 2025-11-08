import Mongoose from "mongoose";
import { CollectionStore } from "../../database.js";
import { CollectionModel } from "./collection.js";
import type { Collection, NewCollection } from "../../interface/collection.js";
import type { User } from "../../interface/user.js";
import { UserModel } from "./user.js";
import { Plant } from "../../interface/plant.js";
import { PlantModel } from "./plant.js";

export const collectionMongoStore: CollectionStore = {
  async getAll(): Promise<Collection[]> {
    return CollectionModel.find().lean();
  },

  async getById(collectionId: Collection["_id"]): Promise<Collection | null> {
    if (!Mongoose.isValidObjectId(collectionId)) return null;
    return CollectionModel.findById(collectionId).lean();
  },

  async getAllForUser(userId: User["_id"]): Promise<Collection[] | null> {
    if (!Mongoose.isValidObjectId(userId)) return null;
    const foundUser = await UserModel.findById(userId).lean();
    if (!foundUser) return null;

    return CollectionModel.find({ userId: userId }).lean();
  },

  async createForUser(userId: User["_id"], newCollection: NewCollection): Promise<Collection | null> {
    if (!Mongoose.isValidObjectId(userId)) return null;
    const foundUser = await UserModel.findById(userId).lean();
    if (!foundUser) return null;
    newCollection = { ...newCollection, userId: userId, plantIds: [], imageUrl: null } as Collection;
    const collection = new CollectionModel(newCollection);
    const collectionObject = await collection.save();
    return CollectionModel.findById(collectionObject._id).lean();
  },

  async update(collection: Collection): Promise<Collection | null> {
    if (!Mongoose.isValidObjectId(collection._id)) return null;
    return CollectionModel.findByIdAndUpdate(
      collection._id,
      {
        name: collection.name,
        description: collection.description,
        imageUrl: collection.imageUrl,
      },
      { new: true }
    ).lean();
  },

  async deleteAll(): Promise<Collection[]> {
    const foundCollections = await CollectionModel.find({}).lean();
    if (foundCollections.length === 0) return [];

    await CollectionModel.deleteMany({});

    return foundCollections;
  },

  async deleteById(collectionId: Collection["_id"]): Promise<Collection | null> {
    if (!Mongoose.isValidObjectId(collectionId)) return null;
    return CollectionModel.findByIdAndDelete({ _id: collectionId }).lean();
  },

  async addPlantToCollection(collectionId: Collection["_id"], plantId: Plant["_id"]): Promise<Collection | null> {
    if (!Mongoose.isValidObjectId(collectionId) || !Mongoose.isValidObjectId(plantId)) return null;
    const foundCollection = CollectionModel.findById(collectionId).lean();
    if (!foundCollection) return null;

    const foundPlant = await PlantModel.findById(plantId).lean();
    if (!foundPlant) return null;

    await CollectionModel.updateOne({ _id: collectionId }, { $addToSet: { plantIds: plantId } });

    return CollectionModel.findById(collectionId).lean();
  },

  async deletePlantFromCollection(collectionId: Collection["_id"], plantId: Plant["_id"]): Promise<Collection | null> {
    if (!Mongoose.isValidObjectId(collectionId) || !Mongoose.isValidObjectId(plantId)) return null;
    const foundCollection = await CollectionModel.findById(collectionId).lean();
    if (!foundCollection) return null;

    const foundPlant = await PlantModel.findById(plantId).lean();
    if (!foundPlant) return null;

    await CollectionModel.updateOne({ _id: collectionId }, { $pull: { plantIds: plantId } });

    return CollectionModel.findById(collectionId).lean();
  },

  async getAllPlantsForCollection(collectionId: Collection["_id"]): Promise<Plant[] | null> {
    if (!Mongoose.isValidObjectId(collectionId)) return null;
    const foundCollection = await CollectionModel.findById(collectionId).lean();
    if (!foundCollection) return null;

    return (await PlantModel.find({ _id: { $in: foundCollection.plantIds } }).lean()) as Plant[];
  },
};

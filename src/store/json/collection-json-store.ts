import { v4 } from "uuid";
import type { CollectionStore, PlantStore } from "../db.js";
import type { User } from "../../model/user.js";
import { jsonFile } from "./store-util.js";
import type { Collection } from "../../model/collection.js";
import type { Plant } from "../../model/plant.js";

export const collectionJsonStore: CollectionStore = {
  async getAll(): Promise<Collection[]> {
    await jsonFile.read();
    return jsonFile.data.collections;
  },

  async getById(collectionId: Collection["_id"]): Promise<Collection | null> {
    await jsonFile.read();
    const foundCollection = jsonFile.data.collections.filter((c: Collection) => c._id === collectionId);
    return foundCollection ?? null;
  },

  async getAllForUser(userId: User["_id"]): Promise<Collection[]> {
    await jsonFile.read();
    return jsonFile.data.collections.filter((c: Collection) => c.userId === userId);
  },

  async createForUser(userId: User["_id"], newCollection: Partial<Collection>): Promise<Collection> {
    await jsonFile.read();
    const collection: Collection = { ...newCollection, _id: v4(), userId: userId } as Collection;
    jsonFile.data.collections.push(collection);
    await jsonFile.write();
    return collection;
  },

  async update(collection: Collection): Promise<Collection | null> {
    await jsonFile.read();
    const index = jsonFile.data.collections.findIndex((c: Collection) => c._id === collection._id);
    if (index === -1) {
      return null;
    }
    jsonFile.data.collections[index] = collection;
    await jsonFile.write();
    return collection;
  },

  async deleteAll(): Promise<Collection[]> {
    await jsonFile.read();
    const foundCollections = jsonFile.data.collections;
    jsonFile.data.collections = [];
    await jsonFile.write();
    return foundCollections;
  },

  async deleteById(collectionId: Collection["_id"]): Promise<Collection | null> {
    await jsonFile.read();
    const index = jsonFile.data.collections.findIndex((c: Collection) => c._id === collectionId);
    if (index === -1) return null;
    const collecation: Collection = jsonFile.data.collections[index];
    jsonFile.data.collections.splice(index, 1);
    await jsonFile.write();
    return collecation;
  },

  async addPlantToCollection(collectionId: Collection["_id"], plantId: Plant["_id"]): Promise<Collection | null> {
    await jsonFile.read();
    const index = jsonFile.data.collections.findIndex((c: Collection) => c._id === collectionId);
    if (index === -1) return null;
    jsonFile.data.collections[index].plantIds.push(plantId);
    await jsonFile.write();
    return jsonFile.data.collections[index];
  },
};

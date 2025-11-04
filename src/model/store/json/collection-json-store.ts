import { v4 } from "uuid";
import type { CollectionStore } from "../../database";
import { jsonFile } from "./store-util.js";
import type { Collection, NewCollection } from "../../interface/collection.js";
import type { User } from "../../interface/user.js";
import type { Plant } from "../../interface/plant.js";

export const collectionJsonStore: CollectionStore = {
  async getAll(): Promise<Collection[]> {
    await jsonFile.read();
    return jsonFile.data.collections;
  },

  async getById(collectionId: Collection["_id"]): Promise<Collection | null> {
    await jsonFile.read();
    const foundCollection = jsonFile.data.collections.find((c: Collection) => c._id === collectionId);
    return foundCollection ?? null;
  },

  async getAllForUser(userId: User["_id"]): Promise<Collection[]> {
    await jsonFile.read();
    return jsonFile.data.collections.filter((c: Collection) => c.userId === userId);
  },

  async createForUser(userId: User["_id"], newCollection: NewCollection): Promise<Collection> {
    await jsonFile.read();
    const collection: Collection = { ...newCollection, _id: v4(), userId: userId, plantIds: [] } as Collection;
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
    const collectionIndex = jsonFile.data.collections.findIndex((c: Collection) => c._id === collectionId);
    if (collectionIndex === -1) return null;
    const plantIndex = jsonFile.data.plants.findIndex((p: Plant) => p._id === plantId);
    if (plantIndex === -1) return null;
    jsonFile.data.collections[collectionIndex].plantIds.push(plantId);
    await jsonFile.write();
    return jsonFile.data.collections[collectionIndex];
  },

  async getAllPlantsForCollection(collectionId: Collection["_id"]): Promise<Plant[]> {
    await jsonFile.read();
    const index = jsonFile.data.collections.findIndex((c: Collection) => c._id === collectionId);
    if (index === -1) return null;
    const ids = jsonFile.data.collections[index].plantIds;
    let plants: Plant[] = [];
    ids.forEach((url: String) => {
      const foundPlant = jsonFile.data.plants.find((p: Plant) => p._id === url);
      plants = [...plants, foundPlant];
    });

    return plants;
  },
};

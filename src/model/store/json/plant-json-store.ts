import { v4 } from "uuid";
import type { NewPlant, Plant } from "../../interface/plant.js";
import { jsonFile } from "./store-util.js";
import type { PlantStore } from "../../database";
import type { User } from "../../interface/user.js";

export const plantJsonStore: PlantStore = {
  async getAll(): Promise<Plant[]> {
    await jsonFile.read();

    return jsonFile.data.plants.map((p: Plant) => ({
      ...p,
      date: new Date(p.date),
    }));
  },

  async getById(plantId: Plant["_id"]): Promise<Plant | null> {
    await jsonFile.read();

    const foundPlant = jsonFile.data.plants.find((p: Plant) => p._id === plantId);
    if (!foundPlant) return null;

    return {
      ...foundPlant,
      date: new Date(foundPlant.date),
    };
  },
  async getAllForUser(userId: User["_id"]): Promise<Plant[]> {
    await jsonFile.read();
    const foundPlants = jsonFile.data.plants.filter((p: Plant) => p.userId === userId);
    return foundPlants.map((p: Plant) => ({
      ...p,
      date: new Date(p.date),
    }));
  },

  async createForUser(userId: User["_id"], newPlant: NewPlant): Promise<Plant> {
    await jsonFile.read();
    const plant: Plant = { ...newPlant, _id: v4(), userId: userId, date: new Date() } as Plant;
    jsonFile.data.plants.push(plant);
    await jsonFile.write();
    return plant;
  },

  async update(plant: Plant): Promise<Plant | null> {
    await jsonFile.read();
    const index = jsonFile.data.plants.findIndex((p: Plant) => p._id === plant._id);
    if (index === -1) {
      return null;
    }
    plant.userId = jsonFile.data.plants[index].userId;
    plant.imageUrls = jsonFile.data.plants[index].imageUrls;
    jsonFile.data.plants[index] = plant;
    await jsonFile.write();
    return plant;
  },

  async deleteAll(): Promise<Plant[]> {
    await jsonFile.read();
    const foundPlants = jsonFile.data.plants;
    jsonFile.data.plants = [];
    await jsonFile.write();
    return foundPlants;
  },

  async deleteById(plantId: Plant["_id"]): Promise<Plant | null> {
    await jsonFile.read();
    const index = jsonFile.data.plants.findIndex((p: Plant) => p._id === plantId);
    if (index === -1) return null;
    const plant: Plant = jsonFile.data.plants[index];
    jsonFile.data.plants.splice(index, 1);
    await jsonFile.write();
    return plant;
  },
};

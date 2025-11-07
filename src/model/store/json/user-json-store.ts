import { v4 } from "uuid";
import type { UserStore } from "../../database.js";
import { jsonFile } from "./store-util.js";
import type { NewUser, User } from "../../interface/user.js";
import type { Plant } from "../../interface/plant.js";
import { Collection } from "../../interface/collection";

// no on delete cascade on json database
async function deleteAllPlantsAndCollectionsForUserId(userId: string) {
  await jsonFile.read();
  const remainingPlants = jsonFile.data.plants.filter((p: Plant) => p.userId !== userId);
  jsonFile.data.plants = remainingPlants;
  await jsonFile.write();
  const remainingCollections = jsonFile.data.collections.filter((c: Collection) => c.userId !== userId);
  jsonFile.data.collections = remainingCollections;
  await jsonFile.write();
}

export const userJsonStore: UserStore = {
  async getAll(): Promise<User[]> {
    await jsonFile.read();
    return jsonFile.data.users;
  },

  async getById(userId: User["_id"]): Promise<User | null> {
    await jsonFile.read();
    const foundUser = jsonFile.data.users.find((u: User) => u._id === userId);
    return foundUser ?? null;
  },

  async getByEmail(userEmail: User["email"]): Promise<User | null> {
    await jsonFile.read();
    const foundUser = jsonFile.data.users.find((u: User) => u.email === userEmail);
    return foundUser ?? null;
  },

  async create(newUser: NewUser): Promise<User> {
    await jsonFile.read();
    const user: User = { ...newUser, _id: v4(), aboutMe: null, imageUrl: null } as User;
    jsonFile.data.users.push(user);
    await jsonFile.write();
    return user;
  },

  async update(user: User): Promise<User | null> {
    await jsonFile.read();
    const index = jsonFile.data.users.findIndex((u: User) => u._id === user._id);
    if (index === -1) {
      return null;
    }
    jsonFile.data.users[index] = user;
    await jsonFile.write();
    return user;
  },

  async deleteAll(): Promise<User[]> {
    await jsonFile.read();
    const foundUsers = jsonFile.data.users;
    jsonFile.data.users = [];
    jsonFile.data.plants = [];
    jsonFile.data.collections = [];
    const test = await jsonFile.write();
    return foundUsers;
  },

  async deleteById(userId: User["_id"]): Promise<User | null> {
    await jsonFile.read();
    const index = jsonFile.data.users.findIndex((u: User) => u._id === userId);
    if (index === -1) return null;
    const user: User = jsonFile.data.users[index];
    await deleteAllPlantsAndCollectionsForUserId(user._id);
    jsonFile.data.users.splice(index, 1);
    await jsonFile.write();
    return user;
  },
};

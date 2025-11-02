import { v4 } from "uuid";
import type { UserStore } from "../db.js";
import type { User } from "../../model/user.js";
import { jsonFile } from "./store-util.js";

export const userJsonStore: UserStore = {
  async getAll(): Promise<User[]> {
    await jsonFile.read();
    return jsonFile.data.users;
  },

  async getById(userId: User["_id"]): Promise<User | null> {
    await jsonFile.read();
    const foundUser = jsonFile.data.users.filter((u: User) => u._id === userId);
    return foundUser ?? null;
  },

  async create(newUser: Partial<User>): Promise<User> {
    await jsonFile.read();
    const user: User = { ...newUser, _id: v4(), imgUrl: "placeholder.com" } as User;
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
    return foundUsers;
  },

  async deleteById(userId: User["_id"]): Promise<User | null> {
    await jsonFile.read();
    const index = jsonFile.data.users.findIndex((u: User) => u._id === userId);
    if (index === -1) return null;
    const user: User = jsonFile.data.users[index];
    jsonFile.data.users.splice(index, 1);
    await jsonFile.write();
    return user;
  },
};

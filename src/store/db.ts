import type { User } from "../model/user.js";
import type { Plant } from "../model/plant.js";
import type { Collection } from "../model/collection.js";
import { userJsonStore } from "./json/user-json-store.js";

type StoreType = "json" | "mongo";

export interface UserStore {
  getAll(): Promise<User[]>;

  getById(userId: User["_id"]): Promise<User | null>;

  create(newUser: Partial<User>): Promise<User>;

  update(user: User): Promise<User | null>;

  deleteAll(): Promise<User[]>;

  deleteById(userId: User["_id"]): Promise<User | null>;
}

export interface PlantStore {
  getAll(): Promise<Plant[]>;

  getById(plantId: Plant["_id"]): Promise<Plant | null>;

  getAllForUser(userId: User["_id"]): Promise<Plant[]>;

  createForUser(userId: User["_id"], newPlant: Partial<Plant>): Promise<Plant>;

  update(plant: Plant): Promise<Plant | null>;

  deleteAll(): Promise<Plant[]>;

  deleteById(plantId: Plant["_id"]): Promise<Plant | null>;
}

export interface CollectionStore {
  getAll(): Promise<Collection[]>;

  getById(collectionId: Collection["_id"]): Promise<Collection | null>;

  getAllForUser(userId: User["_id"]): Promise<Collection[]>;

  createForUser(userId: User["_id"], newCollection: Partial<Collection>): Promise<Collection>;

  update(collection: Collection): Promise<Collection | null>;

  deleteAll(): Promise<Collection[]>;

  deleteById(collectionId: Collection["_id"]): Promise<Collection | null>;
}

interface DataBase {
  userStore: UserStore | null;
  plantStore: PlantStore | null;
  collectionStore: CollectionStore | null;

  init(storeType: StoreType): void;
}

export const dataBase: DataBase = {
  userStore: null,
  plantStore: null,
  collectionStore: null,

  init(storeType: StoreType) {
    if (storeType === "json") {
      this.userStore = userJsonStore;
    } else {
      throw new Error(`unknown storeType ${storeType}`);
    }
  },
};

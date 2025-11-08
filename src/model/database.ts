import dotenv from "dotenv";
import { Types } from "mongoose";
import type { NewUser, User } from "./interface/user.js";
import type { NewPlant, Plant } from "./interface/plant.js";
import type { NewCollection, Collection } from "./interface/collection.js";
import { userJsonStore } from "./store/json/user-json-store.js";
import { plantJsonStore } from "./store/json/plant-json-store.js";
import { collectionJsonStore } from "./store/json/collection-json-store.js";
import { userMogoStore } from "./store/mongo/user-mogo-store.js";
import { plantMongoStore } from "./store/mongo/plant-mongo-store.js";
import { connectMongo } from "./store/mongo/connection.js";
import { collectionMongoStore } from "./store/mongo/collection-mongo-store.js";

type StoreType = "json" | "mongo";

dotenv.config();

const adminList: NewUser[] = [
  {
    email: process.env.ADMIN_EMAIL,
    firstName: "admin",
    secondName: "admin",
    password: process.env.ADMIN_PASSWORD,
  },
];

export interface UserStore {
  initAdmins(admins: NewUser[]): Promise<void>;

  getAllNonAdmin(): Promise<User[]>;

  getAll(): Promise<User[]>;

  getById(userId: User["_id"]): Promise<User | null>;

  getByEmail(userEmail: User["email"]): Promise<User | null>;

  create(newUser: NewUser): Promise<User>;

  update(user: User): Promise<User | null>;

  deleteAll(): Promise<User[]>;

  deleteById(userId: User["_id"]): Promise<User | null>;
}

export interface PlantStore {
  getAll(): Promise<Plant[]>;

  getById(plantId: Plant["_id"]): Promise<Plant | null>;

  getAllForUser(userId: User["_id"]): Promise<Plant[] | null>;

  createForUser(userId: User["_id"], newPlant: NewPlant): Promise<Plant | null>;

  update(plant: Plant): Promise<Plant | null>;

  deleteAll(): Promise<Plant[]>;

  deleteById(plantId: Plant["_id"]): Promise<Plant | null>;
}

export interface CollectionStore {
  getAll(): Promise<Collection[]>;

  getById(collectionId: Collection["_id"]): Promise<Collection | null>;

  getAllForUser(userId: User["_id"]): Promise<Collection[] | null>;

  createForUser(userId: User["_id"], newCollection: NewCollection): Promise<Collection | null>;

  update(collection: Collection): Promise<Collection | null>;

  deleteAll(): Promise<Collection[]>;

  deleteById(collectionId: Collection["_id"]): Promise<Collection | null>;

  addPlantToCollection(collectionId: Collection["_id"], plantId: string | Types.ObjectId): Promise<Collection | null>;

  deletePlantFromCollection(collectionId: Collection["_id"], plantId: string | Types.ObjectId): Promise<Collection | null>;

  getAllPlantsForCollection(collectionId: Collection["_id"]): Promise<Plant[] | null>;
}

interface Database {
  userStore: UserStore | null;
  plantStore: PlantStore | null;
  collectionStore: CollectionStore | null;

  init(storeType: StoreType): Promise<void>;
}

export const database: Database = {
  userStore: null,
  plantStore: null,
  collectionStore: null,

  async init(storeType: StoreType) {
    if (storeType === "json") {
      this.userStore = userJsonStore;
      await this.userStore.initAdmins(adminList);
      this.plantStore = plantJsonStore;
      this.collectionStore = collectionJsonStore;
    } else if (storeType === "mongo") {
      connectMongo();
      this.userStore = userMogoStore;
      await this.userStore.initAdmins(adminList);
      this.plantStore = plantMongoStore;
      this.collectionStore = collectionMongoStore;
    } else {
      throw new Error(`unknown storeType ${storeType}`);
    }
  },
};

import type { NewUser, User } from "./interface/user.js";
import type { NewPlant, Plant } from "./interface/plant.js";
import type { NewCollection, Collection } from "./interface/collection.js";
import { userJsonStore } from "./store/json/user-json-store.js";
import { plantJsonStore } from "./store/json/plant-json-store.js";
import { collectionJsonStore } from "./store/json/collection-json-store.js";

type StoreType = "json" | "mongo";

export interface UserStore {
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

  getAllForUser(userId: User["_id"]): Promise<Plant[]>;

  createForUser(userId: User["_id"], newPlant: NewPlant): Promise<Plant>;

  update(plant: Plant): Promise<Plant | null>;

  deleteAll(): Promise<Plant[]>;

  deleteById(plantId: Plant["_id"]): Promise<Plant | null>;
}

export interface CollectionStore {
  getAll(): Promise<Collection[]>;

  getById(collectionId: Collection["_id"]): Promise<Collection | null>;

  getAllForUser(userId: User["_id"]): Promise<Collection[]>;

  createForUser(userId: User["_id"], newCollection: NewCollection): Promise<Collection>;

  update(collection: Collection): Promise<Collection | null>;

  deleteAll(): Promise<Collection[]>;

  deleteById(collectionId: Collection["_id"]): Promise<Collection | null>;

  addPlantToCollection(collectionId: Collection["_id"], plantId: Plant["_id"]): Promise<Collection | null>;

  deletePlantFromCollection(collectionId: Collection["_id"], plantId: Plant["_id"]): Promise<Collection | null>;

  getAllPlantsForCollection(collectionId: Collection["_id"]): Promise<Plant[]>;
}

interface Database {
  userStore: UserStore | null;
  plantStore: PlantStore | null;
  collectionStore: CollectionStore | null;

  init(storeType: StoreType): void;
}

export const database: Database = {
  userStore: null,
  plantStore: null,
  collectionStore: null,

  init(storeType: StoreType) {
    if (storeType === "json") {
      this.userStore = userJsonStore;
      this.plantStore = plantJsonStore;
      this.collectionStore = collectionJsonStore;
    } else {
      throw new Error(`unknown storeType ${storeType}`);
    }
  },
};

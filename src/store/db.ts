import type { User } from "../model/user.js";
import type { Plant } from "../model/plant.js";
import type { Collection } from "../model/collection.js";

type StoreType = "json" | "mongo";

interface UserStore {
  getAll(): Promise<User[]>;

  getById(userId: User["id"]): Promise<User>;

  create(user: Partial<User>): Promise<User>;

  update(user: User): Promise<User>;

  deleteAll(): Promise<User[]>;

  deleteById(userId: User["id"]): Promise<User>;
}

interface PlantStore {
  getAll(): Promise<Plant[]>;

  getById(plantId: Plant["id"]): Promise<Plant>;

  getAllForUser(userId: User["id"]): Promise<Plant[]>;

  createForUser(userId: User["id"], plant: Partial<Plant>): Promise<User>;

  update(plant: Plant): Promise<Plant>;

  deleteAll(): Promise<Plant[]>;

  deleteById(plantId: Plant["id"]): Promise<Plant>;
}

interface CollectionStore {
  getAll(): Promise<Collection[]>;

  getById(collectionId: Collection["id"]): Promise<Collection>;

  getAllForUser(userId: User["id"]): Promise<Collection[]>;

  createForUser(userId: User["id"], collection: Partial<Collection>): Promise<Collection>;

  update(collection: Collection): Promise<Collection>;

  deleteAll(): Promise<Collection[]>;

  deleteById(collectionId: Collection["id"]): Promise<Collection>;
}
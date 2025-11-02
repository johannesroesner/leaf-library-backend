import type { User } from "./user.js";
import type { Collection } from "./collection.js";

export interface Plant {
  id: String;
  commonName: String;
  scientificName: String;
  type: PlantType;
  biome: Biome,
  imageUrls: String [],
  note: String,
  date: Date,
  latitude: Number,
  longitude: Number,
  userId: User["id"],
}

export type PlantType =
  | "Tree"
  | "Flower"
  | "Fern"
  | "Moss"
  | "Grass"
  | "Aquatic Plant"
  | "Climber"
  | "Other";

export type Biome =
  | "Urban"
  | "Meadow"
  | "Forest"
  | "Pond"
  | "River"
  | "Sea"
  | "Desert"
  | "Other";
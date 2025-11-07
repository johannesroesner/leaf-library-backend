import type { User } from "./user.js";

export const PlantTypeArray = ["Tree", "Flower", "Fern", "Moss", "Grass", "Aquatic Plant", "Climber", "Other"] as const;

export type PlantType = (typeof PlantTypeArray)[number];

export const BiomeArray = ["Urban", "Meadow", "Forest", "Pond", "River", "Sea", "Desert", "Other"] as const;

export type Biome = (typeof BiomeArray)[number];

export interface Plant {
  _id: string;
  commonName: string;
  scientificName: string;
  type: PlantType;
  biome: Biome;
  imageUrls: string[] | null;
  note: string | null;
  date: Date;
  latitude: Number;
  longitude: Number;
  userId: User["_id"];
}

export type NewPlant = Omit<Plant, "_id" | "userId" | "date">;

import type { User } from "./user.js";
import type { Plant } from "./plant.js";

export interface Collection {
  _id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  userId: User["_id"];
  plantIds: Plant["_id"][];
}

export type NewCollection = Omit<Collection, "_id" | "userId" | "plantIds">;

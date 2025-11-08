import { Types } from "mongoose";
import type { Plant } from "./plant.js";

export interface Collection {
  _id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  userId: string | Types.ObjectId;
  plantIds: (string | Types.ObjectId)[];
}

export type NewCollection = Omit<Collection, "_id" | "userId" | "plantIds">;

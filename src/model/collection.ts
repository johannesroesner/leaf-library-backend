import type { User } from "./user.js";
import type { Plant } from "./plant.js";

export interface Collection {
  _id: String;
  name: String;
  description: String;
  imgUrl: String;
  userId: User["_id"];
  plantIds: Plant["_id"][];
}

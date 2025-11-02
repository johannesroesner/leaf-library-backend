import type { User } from "./user.js";
import type { Plant } from "./plant.js";

export interface Collection {
  id: String;
  name: String;
  description: String;
  imgUrl: String;
  userId: User["id"];
  plantIds: Plant["id"][];
}

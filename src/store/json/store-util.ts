import { JSONFilePreset } from "lowdb/node";

export const jsonFile: any = await JSONFilePreset("src/store/json/db.json", {
  users: [],
  plants: [],
  collections: [],
});

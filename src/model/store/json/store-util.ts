import { JSONFilePreset } from "lowdb/node";

export const jsonFile: any = await JSONFilePreset("src/model/store/json/database.json", {
  users: [],
  plants: [],
  collections: [],
});

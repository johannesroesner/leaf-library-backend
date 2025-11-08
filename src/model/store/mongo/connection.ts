import * as dotenv from "dotenv";
import Mongoose from "mongoose";
import * as mongooseSeeder from "mais-mongoose-seeder";
import { seedData } from "./seed-data.js";

const seedLib = mongooseSeeder.default;

async function seed() {
  const seeder = seedLib(Mongoose);
  const dbData = await seeder.seed(seedData, { dropDatabase: false, dropCollections: true });
}

export function connectMongo() {
  dotenv.config();

  Mongoose.set("strictQuery", true);
  Mongoose.connect(process.env.DATABASE);
  const database = Mongoose.connection;

  database.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  database.on("disconnected", () => {
    console.log("database disconnected");
  });

  database.once("open", function () {
    console.log(`database connected to ${this.name} on ${this.host}`);
    seed();
  });
}

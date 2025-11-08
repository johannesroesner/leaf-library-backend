import * as dotenv from "dotenv";
import Mongoose from "mongoose";

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
  });
}

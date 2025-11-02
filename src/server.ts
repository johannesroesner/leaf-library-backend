import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import Handlebars from "handlebars";
import { webRoutes } from "./web-routes.js";

// check if .env file is present
const result: any = dotenv.config();
if (result.eror) {
  console.log(result.error);
}

// get folder path
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

// init server
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  // register plugins
  await server.register(Vision);

  // register template engine
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./view",
    layoutPath: "./view/layout",
    partialsPath: "./view/partial",
    layout: true,
    isCached: false,
  });

  // register server routes
  server.route(webRoutes);

  // start server
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

// catch exceptions
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

// try to init the server
init().catch((error: Error) => {
  console.error(error.message);
});

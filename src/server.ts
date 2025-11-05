import Cookie from "@hapi/cookie";
import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import Handlebars from "handlebars";
import { webRoutes } from "./web-routes.js";
import { database } from "./model/database.js";
import { accountController, validate } from "./controller/account-controller.js";

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
    host: process.env.HOSTe,
  });

  // register plugins
  await server.register([Vision, Inert, Cookie]);

  // define default auth and cookie
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOCKIE_NAME,
      password: process.env.COOCKIE_PASSWORD,
      isSecure: false,
    },
    redirectTo: "/",
    validate: validate,
  });
  server.auth.default("session");

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

  // dataBase init
  database.init("json");

  // start server
  await server.start();
  console.log("server running on %s", server.info.uri);
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

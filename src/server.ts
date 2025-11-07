import Cookie from "@hapi/cookie";
import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import Handlebars from "handlebars";
import Joi from "joi";
import { webRoutes } from "./web-routes.js";
import { database } from "./model/database.js";
import { validate } from "./controller/account-controller.js";
import { apiRoutes } from "./api-routes.js";

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
  await server.register([Vision, Inert, Cookie]);

  // define default auth and cookie
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
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

  // register handlebars helper
  // https://stackoverflow.com/questions/34252817/handlebarsjs-check-if-a-string-is-equal-to-a-value
  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });

  // set joi as validator
  server.validator(Joi);

  // register server routes
  server.route(webRoutes);

  // register api routes
  server.route(apiRoutes);

  // dataBase init
  await database.init("json");

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

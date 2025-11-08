import Cookie from "@hapi/cookie";
import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import Handlebars from "handlebars";
import HapiSwagger from "hapi-swagger";
import Joi from "joi";
import * as jwt from "hapi-auth-jwt2";
import { webRoutes } from "./web-routes.js";
import { database } from "./model/database.js";
import { apiRoutes } from "./api-routes.js";
import { sessionValidate } from "./controller/account-controller.js";
import { jwtValidate } from "./api/jwt-utils.js";

// check if .env file is present
const result: any = dotenv.config();
if (result.eror) {
  console.log(result.error);
}

// set swagger options
const swaggerOptions = {
  info: {
    title: "Leaf Library API",
    version: "0.1",
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  security: [{ jwt: [] }],
};

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
  await server.register([
    Vision,
    Inert,
    Cookie,
    { plugin: jwt },
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  // define default auth and cookie
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
      isSecure: false,
    },
    redirectTo: "/",
    validate: sessionValidate,
  });
  server.auth.default("session");

  server.auth.strategy("jwt", "jwt", {
    key: process.env.COOKIE_PASSWORD,
    validate: jwtValidate,
    verifyOptions: { algorithms: ["HS256"] },
  });

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

  // register handlebars helpers
  // https://stackoverflow.com/questions/34252817/handlebarsjs-check-if-a-string-is-equal-to-a-value
  Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper("encodeURI", (value: string) => encodeURIComponent(value));

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

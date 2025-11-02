import type { ServerRoute } from "@hapi/hapi";
import { testController } from "./controller/testController.js";

export const webRoutes: ServerRoute[] = [
  { method: "GET", path: "/", handler: testController.index },

  // static ressources route for @hapi/inert plugin
  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } } },
];

import type { ServerRoute } from "@hapi/hapi";
import { accountController } from "./controller/account-controller.js";
import { gardenController } from "./controller/garden-controller.js";
import { plantController } from "./controller/plant-controller.js";

export const webRoutes: ServerRoute[] = [
  // account/login routes
  {
    method: "GET",
    path: "/",
    options: accountController.index,
  },
  {
    method: "GET",
    path: "/signup",
    options: accountController.signupGet,
  },
  {
    method: "POST",
    path: "/signup",
    options: accountController.signupPost,
  },
  {
    method: "GET",
    path: "/login",
    options: accountController.loginGet,
  },
  {
    method: "POST",
    path: "/login",
    options: accountController.loginPost,
  },
  {
    method: "GET",
    path: "/logout",
    options: accountController.logout,
  },

  // garden routes
  {
    method: "GET",
    path: "/garden",
    options: gardenController.index,
  },
  {
    method: "POST",
    path: "/garden/addPlant",
    options: gardenController.addPlant,
  },

  // plant routes
  {
    method: "GET",
    path: "/plant/{_id}",
    options: plantController.index,
  },
  {
    method: "GET",
    path: "/plant/{_id}/delete",
    options: plantController.deletePlant,
  },
  {
    method: "POST",
    path: "/plant/{_id}/update",
    options: plantController.updatePlant,
  },

  // route for static resources
  {
    method: "GET",
    path: "/{param*}",
    handler: { directory: { path: "./public" } },
    options: { auth: false },
  },
];

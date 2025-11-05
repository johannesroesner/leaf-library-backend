import type { ServerRoute } from "@hapi/hapi";
import { accountController } from "./controller/account-controller.js";
import { gardenController } from "./controller/garden-controller.js";
import { plantController } from "./controller/plant-controller.js";
import { collectionController } from "./controller/collection-controller.js";

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
    path: "/plant/{plantId}",
    options: plantController.index,
  },
  {
    method: "GET",
    path: "/plant/{plantId}/delete",
    options: plantController.deletePlant,
  },
  {
    method: "POST",
    path: "/plant/{plantId}/update",
    options: plantController.updatePlant,
  },

  // collection routes
  {
    method: "GET",
    path: "/collections",
    options: collectionController.index,
  },
  {
    method: "POST",
    path: "/collections/addCollection",
    options: collectionController.addCollection,
  },
  {
    method: "GET",
    path: "/collection/{collectionId}",
    options: collectionController.getCollection,
  },
  {
    method: "GET",
    path: "/collection/{collectionId}/delete",
    options: collectionController.deleteCollection,
  },
  {
    method: "POST",
    path: "/collection/{collectionId}/update",
    options: collectionController.updateCollection,
  },
  {
    method: "GET",
    path: "/collection/{collectionId}/addPlant/{plantId}",
    options: collectionController.addPlantToCollection,
  },

  // route for static resources
  {
    method: "GET",
    path: "/{param*}",
    handler: { directory: { path: "./public" } },
    options: { auth: false },
  },
];

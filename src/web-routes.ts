import type { ServerRoute } from "@hapi/hapi";
import { accountController } from "./controller/account-controller.js";
import { gardenController } from "./controller/garden-controller.js";
import { plantController } from "./controller/plant-controller.js";
import { collectionController } from "./controller/collection-controller.js";
import { adminController } from "./controller/admin-controller.js";
import { profileController } from "./controller/profile-controller.js";

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
  {
    method: "POST",
    path: "/plant/{plantId}/uploadImage",
    options: plantController.uploadImage,
  },
  {
    method: "GET",
    path: "/plant/{plantId}/deleteImage/{encodedImageUrl}",
    options: plantController.deleteImage,
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
  {
    method: "GET",
    path: "/collection/{collectionId}/deletePlant/{plantId}",
    options: collectionController.deletePlantFromCollection,
  },
  {
    method: "POST",
    path: "/collection/{collectionId}/uploadImage",
    options: collectionController.uploadImage,
  },
  {
    method: "GET",
    path: "/collection/{collectionId}/deleteImage",
    options: collectionController.deleteImage,
  },

  // admin routes
  {
    method: "GET",
    path: "/admin",
    options: adminController.index,
  },
  {
    method: "GET",
    path: "/user/{userId}/delete",
    options: adminController.deleteUser,
  },

  // profile routes
  {
    method: "GET",
    path: "/profile",
    options: profileController.index,
  },
  {
    method: "POST",
    path: "/user/{userId}/update",
    options: profileController.updateProfile,
  },
  {
    method: "POST",
    path: "/user/{userId}/uploadImage",
    options: profileController.uploadImage,
  },
  {
    method: "GET",
    path: "/user/{userId}/deleteImage",
    options: profileController.deleteImage,
  },

  // route for static resources
  {
    method: "GET",
    path: "/{param*}",
    handler: { directory: { path: "./public" } },
    options: { auth: false },
  },
];

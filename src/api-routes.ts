import { ServerRoute } from "@hapi/hapi";
import { userApi } from "./api/user-api.js";
import { plantApi } from "./api/plant-api.js";
import { collectionApi } from "./api/collection-api.js";

export const apiRoutes: ServerRoute[] = [
  // user api routes
  {
    method: "GET",
    path: "/api/user/all",
    options: userApi.getAll,
  },
  {
    method: "GET",
    path: "/api/user/{userId}",
    options: userApi.getOneById,
  },
  {
    method: "GET",
    path: "/api/user/byEmail/{userEmail}",
    options: userApi.getOneByEmail,
  },
  {
    method: "POST",
    path: "/api/user/create",
    options: userApi.create,
  },
  {
    method: "PUT",
    path: "/api/user/update",
    options: userApi.update,
  },
  {
    method: "DELETE",
    path: "/api/user/{userId}/delete",
    options: userApi.deleteOne,
  },
  {
    method: "DELETE",
    path: "/api/user/delete/all",
    options: userApi.deleteAll,
  },

  // plant api routes
  {
    method: "GET",
    path: "/api/plant/all",
    options: plantApi.getAll,
  },
  {
    method: "GET",
    path: "/api/plant/{plantId}",
    options: plantApi.getOneById,
  },
  {
    method: "GET",
    path: "/api/plant/all/forUserId/{userId}",
    options: plantApi.getAllForUser,
  },
  {
    method: "POST",
    path: "/api/plant/create/forUserId/{userId}",
    options: plantApi.createForUserId,
  },
  {
    method: "PUT",
    path: "/api/plant/update",
    options: plantApi.update,
  },
  {
    method: "DELETE",
    path: "/api/plant/{plantId}/delete",
    options: plantApi.deleteOne,
  },
  {
    method: "DELETE",
    path: "/api/plant/delete/all",
    options: plantApi.deleteAll,
  },

  // collection api routes
  {
    method: "GET",
    path: "/api/collection/all",
    options: collectionApi.getAll,
  },
  {
    method: "GET",
    path: "/api/collection/{collectionId}",
    options: collectionApi.getOneById,
  },
  {
    method: "GET",
    path: "/api/collection/all/forUserId/{userId}",
    options: collectionApi.getAllForUser,
  },
  {
    method: "POST",
    path: "/api/collection/create/forUserId/{userId}",
    options: collectionApi.createForUserId,
  },
  {
    method: "PUT",
    path: "/api/collection/update",
    options: collectionApi.update,
  },
  {
    method: "DELETE",
    path: "/api/collection/delete/{collectionId}",
    options: collectionApi.deleteOne,
  },
  {
    method: "DELETE",
    path: "/api/collection/delete/all",
    options: collectionApi.deleteAll,
  },
  {
    method: "POST",
    path: "/api/collection/{collectionId}/addPlant/{plantId}",
    options: collectionApi.addPlantToCollection,
  },
  {
    method: "DELETE",
    path: "/api/collection/{collectionId}/deletePlant/{plantId}",
    options: collectionApi.deletePlantFromCollection,
  },
  {
    method: "GET",
    path: "/api/collection/{collectionId}/plants",
    options: collectionApi.getAllPlantsForCollection,
  },
];

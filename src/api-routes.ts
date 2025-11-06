import { ServerRoute } from "@hapi/hapi";
import { userApi } from "./api/user-api.js";
import { plantApi } from "./api/plant-api.js";

export const apiRoutes: ServerRoute[] = [
  // user api routes
  {
    method: "GET",
    path: "/api/user/all",
    options: userApi.getAll,
  },
  {
    method: "GET",
    path: "/api/user/byId/{userId}",
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
    path: "/api/user/delete/{userId}",
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
    path: "/api/plant/byId/{plantId}",
    options: plantApi.getOneById,
  },
  {
    method: "GET",
    path: "/api/plant/all/byUserId/{userId}",
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
    path: "/api/plant/delete/{plantId}",
    options: plantApi.deleteOne,
  },
  {
    method: "DELETE",
    path: "/api/plant/delete/all",
    options: plantApi.deleteAll,
  },
];

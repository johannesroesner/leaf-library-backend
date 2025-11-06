import { ServerRoute } from "@hapi/hapi";
import { userApi } from "./api/user-api.js";

export const apiRoutes: ServerRoute[] = [
  // user api routes
  {
    method: "GET",
    path: "/api/user/all",
    options: userApi.findAll,
  },
  {
    method: "GET",
    path: "/api/user/byId/{userId}",
    options: userApi.findOneById,
  },
  {
    method: "GET",
    path: "/api/user/byEmail/{userEmail}",
    options: userApi.findOneByEmail,
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
];

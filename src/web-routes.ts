import type { ServerRoute } from "@hapi/hapi";
import { accountController } from "./controller/account-controller.js";

export const webRoutes: ServerRoute[] = [
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

  // route for static resources
  {
    method: "GET",
    path: "/{param*}",
    handler: { directory: { path: "./public" } },
    options: { auth: false },
  },
];

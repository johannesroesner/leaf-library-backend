import type { ServerRoute } from "@hapi/hapi";
import { accountController } from "./controller/account-controller";

export const webRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/",
    options: {
      auth: false,
      handler: accountController.index,
    },
  },
  {
    method: "GET",
    path: "/signup",
    options: {
      auth: false,
      handler: accountController.signupGet,
    },
  },
  {
    method: "POST",
    path: "/signup",
    options: {
      auth: false,
      handler: accountController.signupPost,
    },
  },

  // static ressources route for @hapi/inert plugin
  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } } },
];

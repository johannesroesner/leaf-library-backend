import type { ServerRoute } from "@hapi/hapi";
import { testController } from "./controller/testController.js";

export const webRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/",
    handler: testController.index,
  },
];

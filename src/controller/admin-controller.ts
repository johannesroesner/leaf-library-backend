import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import { Credential } from "./account-controller.js";
import { database } from "../model/database.js";

export const adminController: Record<string, RouteOptions> = {
  index: {
    handler: async (request: Request, responseToolkit: ResponseToolkit) => {
      const credentials = request.auth.credentials as unknown as Credential;

      if (credentials.role !== "admin") {
        return responseToolkit.response({ error: "access denied: admins only." }).code(403);
      }

      const users = await database.userStore.getAllNonAdmin();

      const viewData = {
        title: "Leaf Library - Admin Page",
        users: users,
      };
      return responseToolkit.view("admin-view", viewData);
    },
  },

  deleteUser: {
    handler: async (request: Request, responseToolkit: ResponseToolkit) => {
      const credentials = request.auth.credentials as unknown as Credential;

      if (credentials.role !== "admin") {
        return responseToolkit.response({ error: "access denied: admins only." }).code(403);
      }

      const { userId } = request.params;
      await database.userStore.deleteById(userId);

      return responseToolkit.redirect("/admin");
    },
  },
};

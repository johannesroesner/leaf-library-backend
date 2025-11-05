import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Joi from "joi";
import { database } from "../model/database.js";
import { NewPlantSpec } from "../model/joi-schema.js";
import { NewPlant } from "../model/interface/plant.js";
import { Credential } from "./account-controller.js";

export const gardenController: Record<string, RouteOptions> = {
  index: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const credentials = request.auth.credentials as unknown as Credential;
      const userId = credentials.id;
      const plants = await database.plantStore.getAllForUser(userId);
      const viewData = {
        title: "Leaf Library - Your garden",
        plants: plants,
      };
      return responseToolkit.view("garden-view", viewData);
    },
  },
  addPlant: {
    validate: {
      payload: NewPlantSpec,
      failAction: async function (request: Request, responseToolkit: ResponseToolkit, error: Joi.ValidationError) {
        const loggedInUser: any = request.auth.credentials;
        const plants = await database.plantStore.getAllForUser(loggedInUser._id);
        const viewData = {
          title: "Leaf Library - Your garden error",
          plants: plants,
          error: error,
        };
        return responseToolkit.view("garden-view", viewData).takeover().code(400);
      },
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const credentials = request.auth.credentials as unknown as Credential;
      const userId = credentials.id;
      const newPlant = request.payload as NewPlant;
      await database.plantStore.createForUser(userId, newPlant);
      return responseToolkit.redirect("/garden");
    },
  },
};

import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Joi from "joi";
import { database } from "../model/database.js";
import { NewPlantSpec } from "../model/joi-schema.js";
import { NewPlant, Plant } from "../model/interface/plant.js";
import { Credential } from "./account-controller.js";

export const plantController: Record<string, RouteOptions> = {
  index: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const plantId: String = request.params._id;
      const plant = await database.plantStore.getById(plantId);
      const viewData = {
        title: "Leaf Library - Plant Details",
        plant: plant,
      };
      return responseToolkit.view("plant-view", viewData);
    },
  },

  deletePlant: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const plantId: String = request.params._id;
      const plant = await database.plantStore.deleteById(plantId);

      return responseToolkit.redirect("/garden");
    },
  },

  updatePlant: {
    validate: {
      payload: NewPlantSpec,
      failAction: async function (request: Request, responseToolkit: ResponseToolkit, error: Joi.ValidationError) {
        console.log(error);
        const plantId: String = request.params._id;
        const plant = await database.plantStore.getById(plantId);
        const viewData = {
          title: "Leaf Library - Update plant error",
          plant: plant,
          error: error,
        };
        return responseToolkit.view("plant-view", viewData).takeover().code(400);
      },
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const plantId: String = request.params._id;
      const updatedPlant = request.payload as Plant;
      updatedPlant._id = plantId;
      await database.plantStore.update(updatedPlant);

      /*
      const plant = await database.plantStore.getById(plantId);
      const viewData = {
        title: "Leaf Library - Update plant error",
        plant: plant,
      };

       */
      return responseToolkit.redirect(`/plant/${plantId}`);
    },
  },
};

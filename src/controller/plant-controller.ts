import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Joi from "joi";
import { database } from "../model/database.js";
import { NewPlantSpec } from "../model/joi-schema.js";
import { Plant } from "../model/interface/plant.js";
import { imageStore, ImageUploadPayload } from "../model/store/image-store.js";

export const plantController: Record<string, RouteOptions> = {
  index: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { plantId } = request.params;
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
      const { plantId } = request.params;
      await database.plantStore.deleteById(plantId);

      return responseToolkit.redirect("/garden");
    },
  },

  updatePlant: {
    validate: {
      payload: NewPlantSpec,
      failAction: async function (request: Request, responseToolkit: ResponseToolkit, error: Joi.ValidationError) {
        const { plantId } = request.params;
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
      const { plantId } = request.params;
      const updatedPlant = request.payload as Plant;
      updatedPlant._id = plantId;
      await database.plantStore.update(updatedPlant);

      return responseToolkit.redirect(`/plant/${plantId}`);
    },
  },

  uploadImage: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { plantId } = request.params;
      const plant = await database.plantStore.getById(plantId);

      try {
        const payload = request.payload as ImageUploadPayload;
        const file = payload.imageFile;

        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(file);
          plant.imageUrls.push(url);
          await database.plantStore.update(plant);
        }
        return responseToolkit.redirect(`/plant/${plant._id}`);
      } catch (err) {
        console.log(err);
        return responseToolkit.redirect(`/plant/${plant._id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { plantId, encodedImageUrl } = request.params;
      const plant = await database.plantStore.getById(plantId);
      try {
        const imageUrl = decodeURIComponent(encodedImageUrl);
        console.log(imageUrl);
        await imageStore.deleteImage(imageUrl);

        plant.imageUrls = plant.imageUrls.filter((url) => url !== encodedImageUrl);

        await database.plantStore.update(plant);
        return responseToolkit.redirect(`/plant/${plant._id}`);
      } catch (err) {
        console.log(err);
        return responseToolkit.redirect(`/plant/${plant._id}`);
      }
    },
  },
};

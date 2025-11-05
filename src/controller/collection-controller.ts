import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Joi from "joi";
import { database } from "../model/database.js";
import { NewCollectionSpec, NewPlantSpec } from "../model/joi-schema.js";
import { Credential } from "./account-controller.js";
import { Collection, NewCollection } from "../model/interface/collection";

export const collectionController: Record<string, RouteOptions> = {
  index: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const credentials = request.auth.credentials as unknown as Credential;
      const userId = credentials.id;
      const collections = await database.collectionStore.getAllForUser(userId);
      const viewData = {
        title: "Leaf Library - Collections",
        collections: collections,
      };
      return responseToolkit.view("collection-dashboard-view", viewData);
    },
  },

  addCollection: {
    validate: {
      payload: NewCollectionSpec,
      failAction: async function (request: Request, responseToolkit: ResponseToolkit, error: Joi.ValidationError) {
        const credentials = request.auth.credentials as unknown as Credential;
        const userId = credentials.id;
        const collections = await database.collectionStore.getAllForUser(userId);
        const viewData = {
          title: "Leaf Library - Collections error",
          collections: collections,
          error: error,
        };
        return responseToolkit.view("collection-dashboard-view", viewData).takeover().code(400);
      },
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const credentials = request.auth.credentials as unknown as Credential;
      const userId = credentials.id;
      const newCollection = request.payload as NewCollection;
      await database.collectionStore.createForUser(userId, newCollection);
      return responseToolkit.redirect("/collections");
    },
  },

  deleteCollection: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { collectionId } = request.params;
      await database.collectionStore.deleteById(collectionId);

      return responseToolkit.redirect("/collections");
    },
  },

  getCollection: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { collectionId } = request.params;
      const collection = await database.collectionStore.getById(collectionId);

      const plantsInCollection = await database.collectionStore.getAllPlantsForCollection(collectionId);
      const plantIdsInCollection = plantsInCollection.map((p) => p._id);

      const allPlants = await database.plantStore.getAll();
      const addablePlants = allPlants.filter((p) => !plantIdsInCollection.includes(p._id));
      const viewData = {
        title: "Leaf Library - Collection Details",
        collection: collection,
        plants: plantsInCollection,
        addablePlants: addablePlants,
      };
      return responseToolkit.view("collection-view", viewData);
    },
  },

  updateCollection: {
    validate: {
      payload: NewCollectionSpec,
      failAction: async function (request: Request, responseToolkit: ResponseToolkit, error: Joi.ValidationError) {
        const { collectionId } = request.params;
        const collection = await database.collectionStore.getById(collectionId);
        const viewData = {
          title: "Leaf Library - Update collection error",
          collection: collection,
          error: error,
        };
        return responseToolkit.view("collection-view", viewData).takeover().code(400);
      },
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { collectionId } = request.params;
      const updatedCollection = request.payload as Collection;
      updatedCollection._id = collectionId;
      await database.collectionStore.update(updatedCollection);

      return responseToolkit.redirect(`/collection/${collectionId}`);
    },
  },

  addPlantToCollection: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { collectionId, plantId } = request.params;

      await database.collectionStore.addPlantToCollection(collectionId, plantId);
      return responseToolkit.redirect(`/collection/${collectionId}`);
    },
  },
};

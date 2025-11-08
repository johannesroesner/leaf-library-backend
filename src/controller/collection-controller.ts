import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Joi, { date } from "joi";
import { database } from "../model/database.js";
import { NewCollectionSpec, NewPlantSpec } from "../model/joi-schema.js";
import { Credential } from "./account-controller.js";
import type { Collection, NewCollection } from "../model/interface/collection.js";
import { imageStore, ImageUploadPayload } from "../model/store/image-store.js";

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

      const addedPlants = await database.collectionStore.getAllPlantsForCollection(collectionId);
      const plantIdsInCollection = addedPlants.map((p) => p._id.toString());

      const allPlants = await database.plantStore.getAllForUser(collection.userId.toString());
      const addablePlants = allPlants.filter((p) => !plantIdsInCollection.includes(p._id.toString()));
      const viewData = {
        title: "Leaf Library - Collection Details",
        collection: collection,
        addedPlants: addedPlants,
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

  deletePlantFromCollection: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { collectionId, plantId } = request.params;

      await database.collectionStore.deletePlantFromCollection(collectionId, plantId);
      return responseToolkit.redirect(`/collection/${collectionId}`);
    },
  },
  uploadImage: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { collectionId } = request.params;
      const collection = await database.collectionStore.getById(collectionId);

      try {
        const payload = request.payload as ImageUploadPayload;
        const file = payload.imageFile;

        if (Object.keys(file).length > 0) {
          const oldImageUrl = collection.imageUrl;
          if (oldImageUrl && oldImageUrl !== "") {
            await imageStore.deleteImage(oldImageUrl);
          }
          const url = await imageStore.uploadImage(file);
          collection.imageUrl = url;
          await database.collectionStore.update(collection);
        }
        return responseToolkit.redirect(`/collection/${collection._id}`);
      } catch (err) {
        console.log(err);
        return responseToolkit.redirect(`/collection/${collection._id}`);
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
      const { collectionId } = request.params;
      const collection = await database.collectionStore.getById(collectionId);
      try {
        await imageStore.deleteImage(collection.imageUrl);
        collection.imageUrl = null;
        await database.collectionStore.update(collection);
        return responseToolkit.redirect(`/collection/${collection._id}`);
      } catch (err) {
        console.log(err);
        return responseToolkit.redirect(`/collection/${collection._id}`);
      }
    },
  },
};

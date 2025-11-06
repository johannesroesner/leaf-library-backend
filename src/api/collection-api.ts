import { Request, ResponseObject, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Boom from "@hapi/boom";
import Joi from "joi";
import { database } from "../model/database.js";
import { CollectionArray, CollectionSpec, CollectionSpecPlus, IdSpec, PlantArray } from "../model/joi-schema.js";
import { validationError } from "../logger.js";
import { Collection } from "../model/interface/collection";

export const collectionApi: Record<string, RouteOptions> = {
  getAll: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundCollections = await database.collectionStore.getAll();
        return responseToolkit.response(foundCollections).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database Error");
      }
    },
    tags: ["api"],
    description: "get all collections",
    notes: "returns details of all collections",
    response: { schema: CollectionArray, failAction: validationError },
  },

  getOneById: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundCollection = await database.collectionStore.getById(request.params.collectionId);
        if (!foundCollection) {
          return Boom.notFound("no collection with this id");
        }
        return responseToolkit.response(foundCollection).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "get a collection by id",
    notes: "returns details of the specific collection",
    validate: { params: { collectionId: IdSpec }, failAction: validationError },
    response: { schema: CollectionSpecPlus, failAction: validationError },
  },

  getAllForUser: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundCollections = await database.collectionStore.getAllForUser(request.params.userId);
        return responseToolkit.response(foundCollections).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "get all collections for a user",
    notes: "returns details of all collections for a user",
    validate: { params: { userId: IdSpec }, failAction: validationError },
    response: { schema: CollectionArray, failAction: validationError },
  },

  createForUserId: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const createdCollection = await database.collectionStore.createForUser(request.params.userId, request.payload as Collection);
        if (!createdCollection) {
          return Boom.notFound("no user with this id");
        }
        return responseToolkit.response(createdCollection).code(201);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "create collection for a given user",
    notes: "returns details of the new created plant for the given user",
    validate: { params: { userId: IdSpec }, payload: CollectionSpec, failAction: validationError },
    response: { schema: CollectionSpecPlus, failAction: validationError },
  },

  update: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const updatedCollection = database.collectionStore.update(request.payload as Collection);
        if (!updatedCollection) {
          return Boom.notFound("no collection with this id");
        }
        return responseToolkit.response(updatedCollection).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "update a collection",
    notes: "returns the updated collection",
    validate: { payload: CollectionSpec, failAction: validationError },
    response: { schema: CollectionSpecPlus, failAction: validationError },
  },

  deleteOne: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const deletedCollection = await database.collectionStore.deleteById(request.params.collectionId);
        if (!deletedCollection) {
          return Boom.notFound("no collection with this id");
        }
        return responseToolkit.response().code(204);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "delete a collection by id",
    notes: "delete a collection by a specific id",
    validate: { params: { collectionId: IdSpec }, failAction: validationError },
    response: { schema: Joi.any().empty(), failAction: validationError },
  },

  deleteAll: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const deletedCollections = await database.collectionStore.deleteAll();
        if (deletedCollections.length > 0) {
          return Boom.serverUnavailable("database error");
        }
        return responseToolkit.response().code(204);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "delete all collections",
    notes: "delete all collections at once",
    response: { schema: Joi.any().empty(), failAction: validationError },
  },

  addPlantToCollection: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const collectionWithAddedPlant = await database.collectionStore.addPlantToCollection(request.params.collectionId, request.params.plantId);
        if (!collectionWithAddedPlant) {
          return Boom.notFound("no collection with this collectionId or no plant with this plantId");
        }
        return responseToolkit.response(collectionWithAddedPlant).code(201);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "add a plant to collection",
    notes: "returns details of the collection with added plant",
    validate: { params: { collectionId: IdSpec, plantId: IdSpec }, failAction: validationError },
    response: { schema: CollectionSpecPlus, failAction: validationError },
  },

  deletePlantFromCollection: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const collectionWithDeletedPlant = await database.collectionStore.deletePlantFromCollection(request.params.collectionId, request.params.plantId);
        if (!collectionWithDeletedPlant) {
          return Boom.notFound("no collection with this collectionId");
        }
        return responseToolkit.response().code(204);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "delete a plant from a collection",
    notes: "delete a plant from a collection",
    validate: { params: { collectionId: IdSpec, plantId: IdSpec }, failAction: validationError },
    response: { schema: Joi.any().empty(), failAction: validationError },
  },

  getAllPlantsForCollection: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundPlants = await database.collectionStore.getAllPlantsForCollection(request.params.collectionId);
        return responseToolkit.response(foundPlants).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database Error");
      }
    },
    tags: ["api"],
    description: "get all plants for a collection",
    notes: "returns details of all plants from a collection",
    validate: { params: { collectionId: IdSpec }, failAction: validationError },
    response: { schema: PlantArray, failAction: validationError },
  },
};

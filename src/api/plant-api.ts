import { Request, ResponseObject, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Boom from "@hapi/boom";
import Joi from "joi";
import { validationError } from "../logger.js";
import { database } from "../model/database.js";
import { IdSpec, PlantArray, PlantSpec, PlantSpecPlus } from "../model/joi-schema.js";
import { NewPlant, Plant } from "../model/interface/plant";

export const plantApi: Record<string, RouteOptions> = {
  getAll: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundPlants = await database.plantStore.getAll();
        return responseToolkit.response(foundPlants).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database Error");
      }
    },
    tags: ["api"],
    description: "get all plants",
    notes: "returns details of all plants",
    response: { schema: PlantArray, failAction: validationError },
  },

  getOneById: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundPlant = await database.plantStore.getById(request.params.plantId);
        if (!foundPlant) {
          return Boom.notFound("no plant with this id");
        }
        return responseToolkit.response(foundPlant).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "get a plant by id",
    notes: "returns details of the specific plant",
    validate: { params: { plantId: IdSpec }, failAction: validationError },
    response: { schema: PlantSpecPlus, failAction: validationError },
  },

  getAllForUser: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundPlants = await database.plantStore.getAllForUser(request.params.userId);
        return responseToolkit.response(foundPlants).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "get all plants for user",
    notes: "returns details of all plants for a user",
    validate: { params: { userId: IdSpec }, failAction: validationError },
    response: { schema: PlantArray, failAction: validationError },
  },

  createForUserId: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const createdPlant = await database.plantStore.createForUser(request.params.userId, request.payload as NewPlant);
        if (!createdPlant) {
          return Boom.notFound("no user with this id");
        }
        return responseToolkit.response(createdPlant).code(201);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "create plant for a user",
    notes: "returns details of the newly created plant for the given user",
    validate: { params: { userId: IdSpec }, payload: PlantSpec, failAction: validationError },
    response: { schema: PlantSpecPlus, failAction: validationError },
  },

  update: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const updatedPlant = database.plantStore.update(request.payload as Plant);
        if (!updatedPlant) {
          return Boom.notFound("no plant with this id");
        }
        return responseToolkit.response(updatedPlant).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "update a plant",
    notes: "returns the updated plant",
    validate: { payload: PlantSpec, failAction: validationError },
    response: { schema: PlantSpecPlus, failAction: validationError },
  },

  deleteOne: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const deletedPlant = await database.plantStore.deleteById(request.params.plantId);
        if (!deletedPlant) {
          return Boom.notFound("no plant with this id");
        }
        return responseToolkit.response().code(204);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "delete a plant by id",
    notes: "delete a plant by a specific id",
    validate: { params: { plantId: IdSpec }, failAction: validationError },
    response: { schema: Joi.any().empty(), failAction: validationError },
  },

  deleteAll: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const deletedPlants = await database.plantStore.deleteAll();
        if (deletedPlants.length > 0) {
          return Boom.serverUnavailable("database error");
        }
        return responseToolkit.response().code(204);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "delete all plants",
    notes: "delete all plants at once",
    response: { schema: Joi.any().empty(), failAction: validationError },
  },
};

import { Request, ResponseObject, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Boom from "@hapi/boom";
import Joi from "joi";
import { database } from "../model/database.js";
import { NewUser, User } from "../model/interface/user.js";
import { AuthResponseSpec, IdSpec, NewUserSpec, UserArray, UserSpec, UserSpecPlus } from "../model/joi-schema.js";
import { validationError } from "../logger.js";
import { createToken } from "./jwt-utils.js";

export const userApi: Record<string, RouteOptions> = {
  create: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const newUser = await database.userStore.create(request.payload as NewUser);
        if (newUser) {
          return responseToolkit.response(newUser).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "create a user",
    notes: "returns the newly created user",
    validate: { payload: NewUserSpec, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  getAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundUsers = await database.userStore.getAll();
        return responseToolkit.response(foundUsers).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database Error");
      }
    },
    tags: ["api"],
    description: "get all users",
    notes: "returns details of all user",
    response: { schema: UserArray, failAction: validationError },
  },

  getOneById: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundUser = await database.userStore.getById(request.params.userId);
        if (!foundUser) {
          return Boom.notFound("no user with this id");
        }
        return responseToolkit.response(foundUser).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "get a user by id",
    notes: "returns details of the specific user",
    validate: { params: { userId: IdSpec }, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  getOneByEmail: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const foundUser = await database.userStore.getByEmail(request.params.userEmail);
        if (!foundUser) {
          return Boom.notFound("no user with this email");
        }
        return responseToolkit.response(foundUser).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "get a user by email",
    notes: "returns details of the specific user",
    validate: { params: { userEmail: Joi.string().required() }, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const updatedUser = await database.userStore.update(request.payload as User);
        if (!updatedUser) {
          return Boom.notFound("no user with this id");
        }
        return responseToolkit.response(updatedUser).code(200);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "update a user",
    notes: "returns the updated user",
    validate: { payload: UserSpecPlus, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        const deletedUser = await database.userStore.deleteById(request.params.userId);
        if (!deletedUser) {
          return Boom.notFound("no user with this id");
        }
        return responseToolkit.response().code(204);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "delete a user by id",
    notes: "delete a user by a specific id",
    validate: { params: { userId: IdSpec }, failAction: validationError },
    response: { schema: Joi.any().empty(), failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit): Promise<ResponseObject | Boom.Boom> {
      try {
        await database.userStore.deleteAll();
        return responseToolkit.response().code(204);
      } catch (error) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "delete all users",
    notes: "delete all users at once",
    response: { schema: Joi.any().empty(), failAction: validationError },
  },

  authenticate: {
    auth: false,
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const payload = request.payload as User;
      try {
        const user = (await database.userStore.getByEmail(payload.email)) as User;
        if (!user) return Boom.unauthorized("user not found");
        const passwordsMatch: boolean = payload.password === user.password;
        if (!passwordsMatch) return Boom.unauthorized("invalid password");
        const token = createToken(user);
        return responseToolkit.response({ success: true, name: `${user.firstName} ${user.secondName}`, token: token, _id: user._id }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("database error");
      }
    },
    tags: ["api"],
    description: "authenticate user",
    notes: "authenticate a user to use the api",
    validate: { payload: UserSpecPlus, failAction: validationError },
    response: { schema: AuthResponseSpec, failAction: validationError },
  },
};

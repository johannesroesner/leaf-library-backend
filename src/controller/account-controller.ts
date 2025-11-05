import Hapi, { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Joi from "joi";
import { NewUserSpec, UserCredentialSpec } from "../model/joi-schema.js";
import { database } from "../model/database.js";
import type { NewUser, UserCredential } from "../model/interface/user.js";

export const accountController: Record<string, RouteOptions> = {
  index: {
    auth: false,
    handler: (request: Request, responseToolkit: ResponseToolkit) => responseToolkit.view("index-view", { title: "Leaf Library" }),
  },

  signupGet: {
    auth: false,
    handler: (request: Request, responseToolkit: ResponseToolkit) => responseToolkit.view("signup-view", { title: "Leaf Library - Sign up" }),
  },

  signupPost: {
    auth: false,
    validate: {
      payload: NewUserSpec,
      options: { abortEarly: false },
      failAction: (request: Request, responseToolkit: ResponseToolkit, err: Joi.ValidationError) =>
        responseToolkit
          .view("signup-view", {
            title: "Leaf Library - Sign up error",
            errors: err.details,
          })
          .takeover()
          .code(400),
    },
    handler: async (request: Request, responseToolkit: ResponseToolkit) => {
      const newUser = request.payload as NewUser;
      await database.userStore.create(newUser);
      return responseToolkit.redirect("/");
    },
  },

  loginGet: {
    auth: false,
    handler: (request: Request, responseToolkit: ResponseToolkit) => responseToolkit.view("login-view", { title: "Leaf Library - Login" }),
  },

  loginPost: {
    auth: false,
    validate: {
      payload: UserCredentialSpec,
      options: { abortEarly: false },
      failAction: function (request: Request, responseToolkit: ResponseToolkit, error: Joi.ValidationError) {
        return responseToolkit.view("login-view", { title: "Login error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { email, password } = request.payload as UserCredential;
      const user = await database.userStore.getByEmail(email);
      if (!user || user.password !== password) {
        return responseToolkit.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      return responseToolkit.redirect("/dashboard");
    },
  },

  logout: {
    auth: false,
    handler: function (request: Request, responseToolkit: ResponseToolkit) {
      request.cookieAuth.clear();
      return responseToolkit.redirect("/");
    },
  },
};

interface Session {
  id: string;
}

export const validate = async (request: Request, session: Session) => {
  const user = await database.userStore.getById(session.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
};

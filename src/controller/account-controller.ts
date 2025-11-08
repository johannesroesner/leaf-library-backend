import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Joi from "joi";
import { NewUserSpec, UserCredentialSpec } from "../model/joi-schema.js";
import { database } from "../model/database.js";
import type { NewUser, Role, UserCredential } from "../model/interface/user.js";

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
      failAction: (request: Request, responseToolkit: ResponseToolkit, error: Joi.ValidationError) =>
        responseToolkit
          .view("signup-view", {
            title: "Leaf Library - Sign up error",
            errorDetail: error.details,
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
      return responseToolkit.redirect("/garden");
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

export interface Credential {
  id: string;
  role: Role;
}

export const sessionValidate = async (request: Request, session: Session) => {
  const user = await database.userStore.getById(session.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: { id: user._id, role: user.role } };
};

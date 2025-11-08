import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Joi from "joi";
import { Credential } from "./account-controller.js";
import { database } from "../model/database.js";
import { UserUpdateSpec } from "../model/joi-schema.js";
import type { User } from "../model/interface/user.js";
import { imageStore, ImageUploadPayload } from "../model/store/image-store.js";

export const profileController: Record<string, RouteOptions> = {
  index: {
    handler: async (request: Request, responseToolkit: ResponseToolkit) => {
      const credentials = request.auth.credentials as unknown as Credential;
      const userId = credentials.id;
      const user = await database.userStore.getById(userId);
      const viewData = {
        title: "Leaf Library - Your profile",
        user: user,
      };
      return responseToolkit.view("profile-view", viewData);
    },
  },
  updateProfile: {
    validate: {
      payload: UserUpdateSpec,
      failAction: async function (request: Request, responseToolkit: ResponseToolkit, error: Joi.ValidationError) {
        const { userId } = request.params;
        const user = await database.userStore.getById(userId);
        const viewData = {
          title: "Leaf Library - Update profile error",
          user: user,
          error: error,
        };
        return responseToolkit.view("profile-view", viewData).takeover().code(400);
      },
    },
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { userId } = request.params;
      const updatedUser = request.payload as User;
      updatedUser._id = userId;
      await database.userStore.update(updatedUser);

      return responseToolkit.redirect("/profile");
    },
  },
  uploadImage: {
    handler: async function (request: Request, responseToolkit: ResponseToolkit) {
      const { userId } = request.params;
      const user = await database.userStore.getById(userId);

      try {
        const payload = request.payload as ImageUploadPayload;
        const file = payload.imageFile;

        if (Object.keys(file).length > 0) {
          const oldImageUrl = user.imageUrl;
          if (oldImageUrl && oldImageUrl !== "") {
            await imageStore.deleteImage(oldImageUrl);
          }
          const url = await imageStore.uploadImage(file);
          user.imageUrl = url;
          await database.userStore.update(user);
        }
        return responseToolkit.redirect("/profile");
      } catch (err) {
        console.log(err);
        return responseToolkit.redirect("/profile");
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
      const { userId } = request.params;
      const user = await database.userStore.getById(userId);
      try {
        await imageStore.deleteImage(user.imageUrl);
        user.imageUrl = null;
        await database.userStore.update(user);
        return responseToolkit.redirect("/profile");
      } catch (err) {
        console.log(err);
        return responseToolkit.redirect("/profile");
      }
    },
  },
};

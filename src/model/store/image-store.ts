import { v2 as cloudinary } from "cloudinary";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

export interface ImageUploadPayload {
  imageFile: File;
}

dotenv.config();

const credentials = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
};
cloudinary.config(credentials);

function getPublicIdFromUrl(url: string): string {
  const parts = url.split("/");
  const lastPart = parts.pop();
  return lastPart.split(".")[0];
}

export const imageStore = {
  getAllImages: async function () {
    const result = await cloudinary.api.resources();
    return result.resources;
  },

  uploadImage: async function (imagefile) {
    writeFileSync("./public/temp.img", imagefile);
    const response = await cloudinary.uploader.upload("./public/temp.img");
    return response.url;
  },

  deleteImage: async function (imageUrl) {
    await cloudinary.uploader.destroy(getPublicIdFromUrl(imageUrl), {});
  },
};

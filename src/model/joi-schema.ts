import Joi from "joi";
import { BiomeArray, PlantTypeArray } from "./interface/plant.js";

// id schema
export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid id");

// user schema
export const UserCredentialSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("sheldon.cooper@caltechmail.com").required(),
    password: Joi.string().example("bazinga123!").required(),
  })
  .label("UserCredentials");

export const NewUserSpec = UserCredentialSpec.keys({
  firstName: Joi.string().example("Sheldon").required(),
  lastName: Joi.string().example("Cooper").required(),
}).label("UserDetails");

export const UserSpec = NewUserSpec.keys({
  aboutMe: Joi.string().example("hey im sheldon cooper"),
  imageUrl: Joi.string().example("www.example.com/sheldon-image"),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

// plant schema
export const NewPlantSpec = Joi.object()
  .keys({
    commonName: Joi.string().example("Oak Tree").required(),
    scientificName: Joi.string().example("Quercus robur").required(),
    type: Joi.string()
      .valid(...PlantTypeArray)
      .example("Tree")
      .required(),
    biome: Joi.string()
      .valid(...BiomeArray)
      .example("Forest")
      .required(),
    note: Joi.string().example("Found near the old park").allow(null),
    latitude: Joi.number().precision(7).min(-90).max(90).example(52.5222322).required(),
    longitude: Joi.number().precision(7).min(-180).max(180).example(13.5222322).required(),
  })
  .label("NewPlant");

export const PlantSpec = NewPlantSpec.keys({
  _id: IdSpec,
  date: Joi.date().example("2025-11-05T10:30:00Z"),
  imageUrls: Joi.array().items(Joi.string().uri()).example(["https://example.com/oak1.jpg", "https://example.com/oak2.jpg"]).allow(null),
  userId: IdSpec,
}).label("Plant");

export const PlantArray = Joi.array().items(PlantSpec).label("PlantArray");

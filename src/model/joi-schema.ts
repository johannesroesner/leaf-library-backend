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
  secondName: Joi.string().example("Cooper").required(),
}).label("UserDetails");

export const UserSpec = NewUserSpec.keys({
  aboutMe: Joi.string().allow(null).example("hey im sheldon cooper"),
  imageUrl: Joi.string().allow(null).example("www.example.com/sheldon-image.jpg"),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
  role: Joi.string(),
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
  date: Joi.date().example("2025-11-05T10:30:00Z"),
  imageUrls: Joi.array().items(Joi.string().uri()).example(["https://example.com/oak1.jpg", "https://example.com/oak2.jpg"]).allow(null),
  userId: IdSpec,
}).label("Plant");

export const PlantSpecPlus = PlantSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlantPlus");

export const PlantArray = Joi.array().items(PlantSpecPlus).label("PlantArray");

// collection schema
export const NewCollectionSpec = Joi.object()
  .keys({
    name: Joi.string().example("Summer Flowers").required(),
    description: Joi.string().example("My Summer Flowers Collection").required(),
  })
  .label("NewCollection");

export const CollectionSpec = NewCollectionSpec.keys({
  imageUrl: Joi.string().allow(null).example("www.example.com/summerflower-image.jpg"),
  userId: IdSpec,
  plantIds: Joi.array().items(IdSpec).label("Plant IDs"),
}).label("Collection");

export const CollectionSpecPlus = CollectionSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("CollectionPlus");

export const CollectionArray = Joi.array().items(CollectionSpecPlus).label("CollectionArray");

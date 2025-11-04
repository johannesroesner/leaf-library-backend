import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid id");

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

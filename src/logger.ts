import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import Boom from "@hapi/boom";

export function validationError(request: Request, responseToolkit: ResponseToolkit, error: Joi.ValidationError): Promise<ResponseObject | Boom.Boom> {
  console.log(error.message);
  throw Boom.badRequest(error.message);
}

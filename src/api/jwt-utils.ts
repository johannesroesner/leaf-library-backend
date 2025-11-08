import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "@hapi/hapi";
import dotenv from "dotenv";
import { User } from "../model/interface/user.js";
import { database } from "../model/database.js";

dotenv.config();
const cookiePassword = process.env.COOKIE_PASSWORD as string;

export function createToken(user: User): string {
  const payload = {
    id: user._id,
    email: user.email,
    scope: [],
  };
  const options: jwt.SignOptions = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  return jwt.sign(payload, cookiePassword, options);
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, cookiePassword) as jwt.JwtPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      scope: decoded.scope,
    } as JwtPayload;
  } catch (error) {
    console.log(error.message);
  }
  return null;
}

export async function jwtValidate(decoded: JwtPayload) {
  const user = (await database.userStore.getById(decoded.id)) as User;
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: { id: user._id, role: user.role } };
}

export function getUserIdFromRequest(request: Request): string {
  let userId = null;
  try {
    const { authorization } = request.headers;
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, cookiePassword) as jwt.JwtPayload;
    userId = decodedToken.id;
  } catch (error) {
    userId = null;
  }
  return userId;
}

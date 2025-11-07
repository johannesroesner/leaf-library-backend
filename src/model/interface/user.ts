export type Role = "default" | "admin";

export interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  secondName: string;
  aboutMe: string | null;
  imageUrl: string | null;
  role: Role;
}

export type NewUser = Omit<User, "_id" | "aboutMe" | "imageUrl" | "role">;
export type UserCredential = Omit<User, "_id" | "aboutMe" | "imageUrl" | "firstName" | "secondName">;

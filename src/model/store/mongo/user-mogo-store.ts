import Mongoose from "mongoose";
import type { UserStore } from "../../database.js";
import type { NewUser, User } from "../../interface/user.js";
import { UserModel } from "./user.js";
import { CollectionModel } from "./collection.js";
import { PlantModel } from "./plant.js";

export const userMogoStore: UserStore = {
  async initAdmins(admins: NewUser[]) {
    for (let i = 0; i < admins.length; i += 1) {
      const admin: User = { ...admins[i], aboutMe: null, imageUrl: null, role: "admin" } as User;
      const user = new UserModel(admin);
      // eslint-disable-next-line no-await-in-loop
      await user.save();
    }
  },

  async getAllNonAdmin(): Promise<User[]> {
    return UserModel.find({ role: { $ne: "admin" } }).lean();
  },

  async getAll(): Promise<User[]> {
    return UserModel.find().lean();
  },

  async getById(userId: User["_id"]): Promise<User | null> {
    if (!Mongoose.isValidObjectId(userId)) return null;
    return UserModel.findById(userId).lean();
  },

  async getByEmail(userEmail: User["email"]): Promise<User | null> {
    const foundUser = await UserModel.findOne({ email: userEmail }).lean();
    return foundUser ?? null;
  },

  async create(newUser: NewUser): Promise<User> {
    newUser = { ...newUser, aboutMe: null, imageUrl: null, role: "default" } as User;
    const user = new UserModel(newUser);
    const userObject = await user.save();
    return UserModel.findById(userObject._id).lean();
  },

  async update(user: User): Promise<User | null> {
    if (!Mongoose.isValidObjectId(user._id)) return null;
    return UserModel.findByIdAndUpdate(
      user._id,
      {
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        aboutMe: user.aboutMe,
        imageUrl: user.imageUrl,
      },
      { new: true }
    ).lean();
  },

  async deleteAll(): Promise<User[]> {
    const foundUsers = await UserModel.find({}).lean();
    await UserModel.deleteMany({});
    await PlantModel.deleteMany({});
    await CollectionModel.deleteMany({});
    return foundUsers;
  },

  async deleteById(userId: User["_id"]): Promise<User | null> {
    if (!Mongoose.isValidObjectId(userId)) return null;
    const deletedUser = await UserModel.findByIdAndDelete(userId).lean();
    if (!deletedUser) return null;
    await CollectionModel.deleteMany({ userId: userId });
    await PlantModel.deleteMany({ userId: userId });
    return deletedUser;
  },
};

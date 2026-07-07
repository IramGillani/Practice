import User from "../models/User";
import fs from "fs/promises";
import { SignupProps, IUser } from "../types";

export const findById = (userId: string) => {
  return User.findById(userId);
};

export const deleteFile = async (path: string) => {
  try {
    await fs.unlink(path);
  } catch {}
};

export const getUsers = (filter: object, skip: number, limit: number) => {
  return User.find(filter).skip(skip).limit(limit).populate("taskCount");
};

export const countUsers = (filter: object) => {
  return User.countDocuments(filter);
};

export const findUsersBySearch = (search: string) => {
  return User.find({
    $or: [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  }).select("_id");
};

export const deleteUser = (userId: string) => {
  return User.findByIdAndDelete(userId);
};

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};

export const createUser = (data: SignupProps) => {
  return User.create({
    ...data,
    isVerified: false,
  });
};

export const createSocialUser = (data: {
  email: string;
  name?: string;
  isVerified?: boolean;
}): Promise<IUser> => {
  return User.create({
    email: data.email,
    name: data.name,
    isSocialLogin: true,
    isVerified: data.isVerified,
  });
};

export const clearRefreshToken = (userId: string) => {
  return User.findByIdAndUpdate(userId, {
    refreshToken: null,
  });
};

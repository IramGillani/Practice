import User from "../models/User";
import fs from "fs/promises";
import { SignupProps, IUser } from "../types";
import { UpdateQuery } from "mongoose";

const SUBSCRIPTION_PROJECTION = "status planId trialEndsAt expiresAt";

export const findById = (userId: string) => {
  return User.findById(userId).populate(
    "subscription",
    SUBSCRIPTION_PROJECTION,
  );
};

export const findByIdBasic = (userId: string) => {
  return User.findById(userId);
};
export const findUserByStripeCustomerId = (stripeCustomerId: string) => {
  return User.findOne({ stripeCustomerId }).populate(
    "subscription",
    SUBSCRIPTION_PROJECTION,
  );
};
export const findUserByEmail = (email: string) => {
  return User.findOne({ email }).populate(
    "subscription",
    SUBSCRIPTION_PROJECTION,
  );
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
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  }).select("_id");
};

export const deleteUser = (userId: string) => {
  return User.findByIdAndDelete(userId);
};

export const createUser = (data: SignupProps) => {
  return User.create({ ...data });
};

export const createSocialUser = (data: {
  email: string;
  name?: string;
  isVerified?: boolean;
  stripeCustomerId: string;
}): Promise<IUser> => {
  return User.create({
    email: data.email,
    name: data.name,
    isSocialLogin: true,
    isVerified: data.isVerified,
    stripeCustomerId: data.stripeCustomerId,
  });
};

export const clearRefreshToken = (userId: string) => {
  return User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const updateById = (
  userId: string,
  update: UpdateQuery<IUser>,
  options = { new: true },
) => {
  return User.findByIdAndUpdate(userId, update, options).populate(
    "subscription",
    SUBSCRIPTION_PROJECTION,
  );
};

export const updateUserStripeCustomer = (
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
) => {
  return User.findByIdAndUpdate(
    userId,
    { stripeCustomerId, stripeSubscriptionId },
    { new: true },
  ).populate("subscription", SUBSCRIPTION_PROJECTION);
};

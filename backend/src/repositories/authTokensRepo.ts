import { Types } from "mongoose";
import { Auth_Tokens } from "../models/Auth_Tokens";

import { EmailType } from "../types/Auth";

export const saveAuthToken = async (
  userId: string | Types.ObjectId,
  hashedToken: string,
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
) => {
  await Auth_Tokens.deleteMany({
    userId,
    type,
  });

  return Auth_Tokens.create({
    userId,
    token: hashedToken,
    type,
  });
};

export const findAuthToken = (
  userId: string | Types.ObjectId,
  token: string,
  type: EmailType,
) => {
  return Auth_Tokens.findOne({
    userId,
    token,
    type,
  });
};

export const deleteAuthToken = (
  tokenId: string | Types.ObjectId,
  tokenType: EmailType,
) => {
  return Auth_Tokens.deleteOne({
    _id: tokenId,
    type: tokenType,
  });
};

export const deleteAuthTokens = (
  userId: string | Types.ObjectId,
  type: EmailType,
) => {
  return Auth_Tokens.deleteMany({
    userId,
    type,
  });
};

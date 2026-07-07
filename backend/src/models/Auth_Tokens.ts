import { Schema, model, Document, Types } from "mongoose";
import { EmailType } from "../types";

export interface IAuth_Tokens extends Document {
  userId: Types.ObjectId;
  token: string;
  createdAt: Date;
  type: string;
}

const Auth_TokensSchema = new Schema<IAuth_Tokens>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,

    enum: EmailType,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // MongoDB TTL
  },
});

export const Auth_Tokens = model<IAuth_Tokens>(
  "Auth_Tokens",
  Auth_TokensSchema,
);

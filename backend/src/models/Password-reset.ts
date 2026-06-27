import { Schema, model, Document, Types } from "mongoose";

export interface IPassword_Reset extends Document {
  userId: Types.ObjectId;
  token: string;
  createdAt: Date;
}

const Password_ResetSchema = new Schema<IPassword_Reset>({
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
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // MongoDB TTL
  },
});

export const Password_Reset = model<IPassword_Reset>(
  "Password_Reset",
  Password_ResetSchema,
);

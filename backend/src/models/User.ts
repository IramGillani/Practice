import { Schema, model, Document, Model } from "mongoose";
import { IUser } from "../types/User";
import bcrypt from "bcrypt";

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, {}, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String, default: null },
    profile: { type: String },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual("profileUrl").get(function () {
  if (!this.profile) return null;

  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  return `${baseUrl}${this.profile}`;
});

export default model<IUser, Model<IUser, {}, IUserMethods>>("User", userSchema);

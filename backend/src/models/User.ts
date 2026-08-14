import { Schema, model, Document, Model } from "mongoose";
import { IUser } from "../types/User";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import path from "path";

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, {}, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String, default: null },
    profile: { type: String },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    isSocialLogin: {
      type: Boolean,
      default: false,
    },
    isVerified: { type: Boolean, default: false },
    isInvitedUser: { type: Boolean, default: false },
    isOnboardingCompleted: { type: Boolean, default: false },
    hasUsedTrial: { type: Boolean, default: false },

    organization: {
      name: { type: String },
      url: { type: String },
      teamSize: { type: String, enum: ["1", "2-10", "11+"] },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret, options) => {
        return {
          _id: ret._id,
          name: ret.name,
          email: ret.email,
          role: ret.role,
          profileUrl: ret.profileUrl || "",
          taskCount: ret.taskCount || 0,
          isVerified: ret.isVerified,
          isInvited: ret.isInvitedUser,
          isOnboardingCompleted: ret.isOnboardingCompleted,
          subscription: ret.subscription
            ? {
                status: ret.subscription.status || null,
                planId: ret.subscription.planId || null,
                trialEndsAt: ret.subscription.trialEndsAt || null,
                expiresAt: ret.subscription.expiresAt || null,
                startedAt: ret.subscription.startedAt || null,
              }
            : null,
        };
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isModified("profile") && !this.isNew) {
    try {
      const userModel = this.constructor as Model<IUser>;
      const userBeforeSave = await userModel.findById(this._id);

      if (userBeforeSave && userBeforeSave.profile) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          userBeforeSave.profile,
        );

        try {
          await fs.access(oldImagePath);
          await fs.unlink(oldImagePath);
        } catch (fileErr) {
          console.warn(
            "File already missing or inaccessible, skipping unlink.",
          );
        }
      }
    } catch (err) {
      console.error("Database lookup for old profile failed:", err);
    }
  }
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

userSchema.virtual("taskCount", {
  ref: "Todo",
  localField: "_id",
  foreignField: "userId",
  count: true,
});

userSchema.virtual("subscription", {
  ref: "Subscription",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

export default model<IUser, Model<IUser, {}, IUserMethods>>("User", userSchema);

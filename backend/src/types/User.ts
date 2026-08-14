import { Types } from "mongoose";
import { ISubscription } from "./Subscription";
import { TeamSize } from "./Auth";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  role: string;
  refreshToken?: string | null;
  profile: string;
  profileUrl?: string;
  taskCount?: number;
  isSocialLogin: boolean;
  isVerified: boolean;
  isInvitedUser: boolean;
  isOnboardingCompleted: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId?: string | null;
  hasUsedTrial: boolean;
  organization?: {
    name: string;
    url: string;
    teamSize: TeamSize;
  };
  subscription?: ISubscription | null;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileUrl: string;
  taskCount?: number;
  isVerified: boolean;
}

export interface UserParams {
  userId: string;
}

export interface UpdateInfoProps {
  userId: string;
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  file?: Express.Multer.File;
}

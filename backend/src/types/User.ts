export interface IUser {
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
export enum EmailType {
  PASSWORD_RESET = "PASSWORD_RESET",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

export interface EmailParams {
  email: string;
  link: string;
  type: EmailType;
}

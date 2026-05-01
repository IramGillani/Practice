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
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileUrl: string;
}

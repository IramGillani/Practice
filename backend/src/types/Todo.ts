import mongoose from "mongoose";
export interface ITodo {
  text: string;
  completed: boolean;
  createdAt: Date;
  userId: mongoose.Types.ObjectId | string;
}

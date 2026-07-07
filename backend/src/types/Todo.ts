import mongoose from "mongoose";
export interface ITodo {
  text: string;
  completed: boolean;
  createdAt: Date;
  userId: mongoose.Types.ObjectId | string;
}

export interface GetTodosProps {
  userId: string;
  limit: number;
  skip: number;
}

export interface CreateTodoData {
  text: string;
  userId: string;
}

export interface UpdateTodoProps {
  todoId: string;
  userId: string;
  updates: Partial<ITodo>;
}
export interface DeleteTodoProps {
  todoId: string;
  userId: string;
}

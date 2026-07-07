import Todo from "../models/Todo";
import { CreateTodoData } from "../types";
import { ITodo } from "../types";

export const countByUser = (userId: string) => {
  return Todo.countDocuments({
    userId,
  });
};
export const findByUser = (
  userId: string,
  options: {
    limit: number;
    skip: number;
  },
) => {
  return Todo.find({ userId })
    .sort({ createdAt: -1 })
    .skip(options.skip)
    .limit(options.limit);
};

export const create = (data: CreateTodoData) => {
  return Todo.create(data);
};

export const updateById = (
  todoId: string,
  userId: string,
  updates: Partial<ITodo>,
) => {
  return Todo.findOneAndUpdate({ _id: todoId, userId }, updates, {
    new: true,
    runValidators: true,
  });
};

export const deleteById = (todoId: string, userId: string) => {
  return Todo.findOneAndDelete({
    _id: todoId,
    userId,
  });
};
export const getTasks = (filter: object, skip: number, limit: number) => {
  return Todo.find(filter)
    .populate("userId", "name email")
    .skip(skip)
    .limit(limit)
    .lean();
};

export const countTasks = (filter: object) => {
  return Todo.countDocuments(filter);
};

export const deleteTask = (taskId: string) => {
  return Todo.findByIdAndDelete(taskId);
};

export const deleteTasksByUserId = (userId: string) => {
  return Todo.deleteMany({ userId });
};

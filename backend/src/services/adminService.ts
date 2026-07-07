import User from "../models/User";
import Todo from "../models/Todo";
import { formatPagination } from "../utils/pagination";
import * as UserRepo from "../repositories/userRepo";
import * as TodoRepo from "../repositories/todoRepo";
import { PaginatedListProps } from "../types";
import { AppError } from "../utils/customErrorHandler";

export const getDashboardSummary = async () => {
  const [totalUsers, totalTasks, completedTasks] = await Promise.all([
    User.countDocuments(),
    Todo.countDocuments(),
    Todo.countDocuments({ completed: true }),
  ]);

  return {
    totalUsers,
    totalTasks,
    completedTasks,
  };
};

export const getAllUsers = async ({
  page,
  limit,
  skip,
  search,
}: PaginatedListProps) => {
  const searchQuery = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    UserRepo.getUsers(searchQuery, skip, limit),
    UserRepo.countUsers(searchQuery),
  ]);

  return {
    data: users,
    pagination: formatPagination(page, limit, total),
  };
};
export const getAllTasks = async ({
  page,
  limit,
  skip,
  search,
}: PaginatedListProps) => {
  let userIds: string[] = [];

  if (search) {
    const users = await UserRepo.findUsersBySearch(search);
    userIds = users.map((user) => user._id.toString());
  }

  const taskQuery = search
    ? {
        $or: [
          {
            text: {
              $regex: search,
              $options: "i",
            },
          },
          {
            userId: {
              $in: userIds,
            },
          },
        ],
      }
    : {};

  const [tasks, total] = await Promise.all([
    TodoRepo.getTasks(taskQuery, skip, limit),
    TodoRepo.countTasks(taskQuery),
  ]);

  return {
    data: tasks,
    pagination: formatPagination(page, limit, total),
  };
};

export const deleteUser = async (userId: string) => {
  if (!userId) {
    throw new AppError(404, "User not found");
  }

  await Promise.all([
    UserRepo.deleteUser(userId),
    TodoRepo.deleteTasksByUserId(userId),
  ]);

  return {
    message: "User and their tasks deleted",
  };
};

export const deleteTask = async (taskId: string) => {
  const deletedTask = await TodoRepo.deleteTask(taskId);

  if (!deletedTask) {
    throw new AppError(404, "Task not found");
  }

  return {
    message: "Task deleted",
  };
};

import User from "../models/User.js";
import Todo from "../models/Todo.js";
import { Request, Response } from "express";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalTasks, completedTasks] = await Promise.all([
      User.countDocuments(),
      Todo.countDocuments(),
      Todo.countDocuments({ completed: true }),
    ]);
    return res.status(200).json({
      success: true,
      data: { totalUsers, totalTasks, completedTasks },
    });
  } catch (error) {
    console.error("Error fetching summary:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search ? String(req.query.search).trim() : "";

    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(searchQuery).skip(skip).limit(limit).populate("taskCount"),
      User.countDocuments(searchQuery),
    ]);

    return res.status(200).json({
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search ? String(req.query.search).trim() : "";

    let userIds: string[] = [];

    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      userIds = users.map((u) => u._id);
    }

    const taskQuery = search
      ? {
          $or: [
            { text: { $regex: search, $options: "i" } },
            { userId: { $in: userIds } },
          ],
        }
      : {};

    const [tasks, total] = await Promise.all([
      Todo.find(taskQuery)
        .populate("userId", "name email")
        .skip(skip)
        .limit(limit)
        .lean(),

      Todo.countDocuments(taskQuery),
    ]);

    return res.status(200).json({
      data: tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    await User.findByIdAndDelete(userId);
    await Todo.deleteMany({ userId });

    res.json({ message: "User and their tasks deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deletedTask = await Todo.findByIdAndDelete(req.params.taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

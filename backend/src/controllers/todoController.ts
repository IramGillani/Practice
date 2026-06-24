import { Request, Response } from "express";
import Todo from "../models/Todo";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const skip = parseInt(req.query.skip as string) || 0;

    const query = { userId: req.user._id };

    const totalTasks = await Todo.countDocuments(query);

    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      tasks: todos,
      hasMore: skip + todos.length < totalTasks,
    });
  } catch (error) {
    console.error("❌ GET Error:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      console.warn("⚠️ Validation failed: 'text' field is missing or empty");
      return res.status(400).json({ message: "Must enter a task" });
    }

    const newTodo = await Todo.create({ text, userId: req.user._id });

    res.status(201).json(newTodo);
  } catch (error) {
    console.error("❌ POST Error:", error);
    res.status(400).json({ message: "Invalid data provided for task" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const updates = req.body;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id, userId: req.user._id },
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTodo)
      return res.status(404).json({ message: "Task not found" });

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("❌ PATCH Error:", error);
    res.status(400).json({ message: "Failed to update task" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    const deletedTodo = await Todo.findOneAndDelete({
      _id,
      userId: req.user._id,
    });

    if (!deletedTodo) {
      console.warn(`⚠️ Task ${_id} not found in Database`);
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ _id, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

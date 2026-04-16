import { Request, Response } from "express";
import Todo from "../models/Todo";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    console.log("👤 User ID:", req.user._id);
    console.log(`✅ Fetched ${todos.length} tasks`);

    res.status(200).json(todos);
  } catch (error) {
    console.error("❌ GET Error:", error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    console.log("📥 Incoming POST body:", req.body);
    const { text } = req.body;

    if (!text || text.trim() === "") {
      console.warn("⚠️ Validation failed: 'text' field is missing or empty");
      return res.status(400).json({ message: "Must enter a task" });
    }

    const newTodo = await Todo.create({ text, userId: req.user._id });
    console.log("✨ Task Created:", newTodo);
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
    console.log(`🔄 Updating Task ${_id} with:`, updates);

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
    console.log(`🗑️ Attempting to delete ID: ${_id}`);

    const deletedTodo = await Todo.findOneAndDelete({
      _id,
      userId: req.user._id,
    });

    if (!deletedTodo) {
      console.warn(`⚠️ Task ${_id} not found in Database`);
      return res.status(404).json({ message: "Task not found" });
    }

    console.log(`✅ Successfully deleted task: ${_id}`);
    res.status(200).json({ _id, message: "Deleted successfully" });
  } catch (error) {
    console.error("❌ Server Error during delete:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

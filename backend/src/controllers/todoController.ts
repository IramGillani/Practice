import { asyncHandler } from "../utils/asyncHandler";
import * as TodoService from "../services/todoService";

export const getTodos = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const skip = Number(req.query.skip) || 0;

  const data = await TodoService.getTodos({
    userId: req.user._id,
    limit,
    skip,
  });

  return res.status(200).json(data);
});

export const createTodo = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const todo = await TodoService.createTodo({
    text,
    userId: req.user._id,
  });

  return res.status(201).json(todo);
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const todo = await TodoService.updateTodo({
    todoId: _id,
    userId: req.user._id,
    updates: req.body,
  });

  return res.status(200).json(todo);
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  await TodoService.deleteTodo({
    todoId: _id,
    userId: req.user._id,
  });

  return res.status(200).json({
    _id,
    message: "Deleted successfully",
  });
});

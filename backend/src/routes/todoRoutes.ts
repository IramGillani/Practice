import { Router } from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";

const router = Router();

// Standard RESTful pattern
router.get("/", getTodos); // GET /api/todos
router.post("/", createTodo); // POST /api/todos
router.patch("/:id", updateTodo); // PATCH /api/todos/:id
router.delete("/:id", deleteTodo); // DELETE /api/todos/:id

export default router;

import { Router } from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.use(authenticateToken);

router.get("/", getTodos); // GET /api/todos
router.post("/", createTodo); // POST /api/todos
router.patch("/:_id", updateTodo); // PATCH /api/todos/:_id
router.delete("/:_id", deleteTodo); // DELETE /api/todos/:_id

export default router;

// routes/adminRoutes.js
import express from "express";
import {
  getAllUsers,
  getAllTasks,
  deleteUser,
  deleteTask,
  getDashboardData,
} from "../controllers/adminController.js";

import { authenticateToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(authenticateToken);
router.use(isAdmin);

router.get("/dashboard", getDashboardData);
router.get("/users", getAllUsers);
router.get("/tasks", getAllTasks);
router.delete("/users/:userId", deleteUser);
router.delete("/tasks/:taskId", deleteTask);

export default router;

import * as AdminService from "../services/adminService";
import { getPaginationParams } from "../utils/pagination";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboardData = asyncHandler(async (req, res) => {
  const data = await AdminService.getDashboardSummary();

  return res.status(200).json({
    data,
  });
});

export const getAllTasks = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(
    req.query.page,
    req.query.limit,
  );
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  const tasks = await AdminService.getAllTasks({
    page,
    limit,
    skip,
    search,
  });
  res.status(200).json(tasks);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(
    req.query.page,
    req.query.limit,
  );
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  const users = await AdminService.getAllUsers({
    page,
    limit,
    skip,
    search,
  });
  res.status(200).json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId as string;

  const result = await AdminService.deleteUser(userId);

  res.status(200).json(result);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params as { taskId: string };

  const result = await AdminService.deleteTask(taskId);

  res.status(200).json(result);
});

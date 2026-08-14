import express from "express";
import { updateInfo } from "../controllers/userController";
import upload from "../middlewares/upload";

import { authenticateToken } from "../middlewares/auth";
import { getProfile } from "../controllers/userController";

const router = express.Router();

router.use(authenticateToken);
router.patch(
  "/updateInfo",

  upload.single("profile"),
  updateInfo,
);
router.get("/", getProfile);

export default router;

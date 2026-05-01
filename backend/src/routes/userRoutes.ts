import express from "express";
import { updateInfo } from "../controllers/userController";
import upload from "../middlewares/upload";

import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.use(authenticateToken);
router.patch("/updateInfo", upload.single("profile"), updateInfo);

export default router;

import express from "express";
import { updateProfile, updatePassword } from "../controllers/userController";
import upload from "../middlewares/upload";

import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.use(authenticateToken);
router.patch("/updatePassword", updatePassword);
router.patch("/updateProfile", upload.single("profile"), updateProfile);

export default router;

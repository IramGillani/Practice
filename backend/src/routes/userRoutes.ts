import { Router } from "express";
import {
  signup,
  login,
  refreshAccessToken,
  logout,
} from "../controllers/userController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);

// router.get("/profile", authMiddleware, getProfile);

export default router;

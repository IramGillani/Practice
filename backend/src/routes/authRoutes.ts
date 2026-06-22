import { Router } from "express";
import {
  signup,
  login,
  refreshAccessToken,
  logout,
  socialLogin,
} from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/social-login", socialLogin);
// router.get("/profile", authMiddleware, getProfile);

export default router;

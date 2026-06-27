import { Router } from "express";
import {
  signup,
  login,
  refreshAccessToken,
  logout,
  socialLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { forgotPasswordLimiter } from "../middlewares/rate-limiter";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshAccessToken);
router.post("/social-login", socialLogin);
// router.get("/profile", authMiddleware, getProfile);

export default router;

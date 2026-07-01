import { Router } from "express";
import {
  signup,
  login,
  refreshAccessToken,
  logout,
  socialLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController";
import { rateLimiter } from "../middlewares/rate-limiter";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", rateLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshAccessToken);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", rateLimiter, resendVerificationEmail);
router.post("/social-login", socialLogin);
// router.get("/profile", authMiddleware, getProfile);

export default router;

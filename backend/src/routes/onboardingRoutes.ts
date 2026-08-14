import { Router } from "express";
import { submitOnboarding } from "../controllers/onboardingController";
import { authenticateToken } from "@/middlewares/auth";

const router = Router();

router.post("/", authenticateToken, submitOnboarding);

// router.get("/profile", authMiddleware, getProfile);

export default router;

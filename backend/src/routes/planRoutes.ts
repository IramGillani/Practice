import { Router } from "express";
import { getPlans, getRedirectUrl } from "../controllers/planController";
import { authenticateToken } from "@/middlewares/auth";

const router = Router();
router.use(authenticateToken);
router.get("/", getPlans);
router.post("/selectPlan", getRedirectUrl);
export default router;

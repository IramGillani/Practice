import { Router } from "express";
import {
  getPlans,
  getRedirectUrl,
  upgradePlan,
} from "../controllers/planController";
import { authenticateToken } from "@/middlewares/auth";

const router = Router();
router.use(authenticateToken);
router.get("/", getPlans);
router.post("/selectPlan", getRedirectUrl);
router.post("/upgradePlan", upgradePlan);
export default router;

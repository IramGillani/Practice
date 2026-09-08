import { Router } from "express";
import {
  getPlans,
  getRedirectUrl,
  upgradePlan,
  downgradePlan,
} from "../controllers/planController";
import { authenticateToken } from "@/middlewares/auth";

const router = Router();
router.use(authenticateToken);
router.get("/", getPlans);
router.post("/selectPlan", getRedirectUrl);
router.post("/upgradePlan", upgradePlan);
router.post("/downgradePlan", downgradePlan);
export default router;

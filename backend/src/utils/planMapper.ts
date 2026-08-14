import { PlanId } from "@/types/Plan";

export const getRecommendedPlanId = (teamSize?: string): PlanId => {
  switch (teamSize) {
    case "1":
      return "individual";
    case "2-10":
      return "team";
    case "11+":
      return "enterprise";
    default:
      return "free";
  }
};

import { Plan } from "@/models/Plan";
export const getAllPlans = () => {
  return Plan.find({}).lean();
};

export const findByPlanId = (planId: string) => {
  return Plan.findOne({ planId }).lean();
};

export const findPlanByStripePriceId = async (stripePriceId: string) => {
  return Plan.findOne({ stripePriceId });
};

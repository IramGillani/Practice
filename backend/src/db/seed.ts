import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Plan } from "../models/Plan";

dotenv.config();

const INITIAL_PLANS = [
  {
    planId: "free",
    name: "Free",
    price: 0,
    stripePriceId: null,
    billingCycle: "free",
    features: ["1 User", "Limited Task Storage"],
    isRecommended: false,
    maxTeamSize: 1,
    trialPeriodDays: 0,
  },
  {
    planId: "individual",
    name: "Individual",
    price: 10,
    stripePriceId: "price_1TtjIHEQkrJAoGgXM6ehks21",
    billingCycle: "monthly",
    features: ["1 User", "Basic Analytics", "Unlimited Task Storage"],
    isRecommended: false,
    maxTeamSize: 1,
    trialPeriodDays: 0,
  },
  {
    planId: "team",
    name: "Team",
    price: 49,
    stripePriceId: "price_1TtjOfEQkrJAoGgXI2cJFF6Q",
    billingCycle: "monthly",
    features: [
      "Up to 10 Users",
      "Advanced Analytics",
      "50GB Storage",
      "Priority Support",
      "3-day Free Trial",
    ],
    isRecommended: true,
    maxTeamSize: 10,
    trialPeriodDays: 3,
  },
  {
    planId: "enterprise",
    name: "Enterprise",
    price: 299,
    stripePriceId: "price_1TtjP6EQkrJAoGgXIJdxfCgf",
    billingCycle: "monthly",
    features: [
      "Unlimited Users",
      "Custom Integrations",
      "Dedicated Account Manager",
    ],
    isRecommended: false,
    maxTeamSize: 9999,
    trialPeriodDays: 0,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/onboarding-app";
    console.log("🌱 Connecting to database for seeding...");
    await mongoose.connect(mongoUri);

    // await Plan.deleteMany({});

    console.log("🔄 Upserting system plans...");

    for (const planData of INITIAL_PLANS) {
      await Plan.findOneAndUpdate({ planId: planData.planId }, planData, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      console.log(`✅ Plan [${planData.planId}] synchronized.`);
    }

    console.log("🎉 Seeding successfully completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();

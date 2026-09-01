import { useEffect, useState } from "react";
import { Check, Loader2, Zap, ShieldCheck } from "lucide-react";
import { PricingSkeleton } from "@/components/Skeletons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { planService } from "@/api/planApi";
import type { PlanId, Plan, PlanSelectionResponse } from "@/types/Plan";
import { useAuth } from "@/context/AuthContext";

export default function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, updateUserData } = useAuth();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const currentPlanId = user?.subscription?.planId || null;

  const currentPlan = plans.find((p) => p.planId === currentPlanId);
  const hasActiveSubscription = Boolean(currentPlanId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await planService.getPlans();
        const fetchedPlans: Plan[] = response.data || [];
        setPlans(fetchedPlans);

        if (currentPlanId) {
          setSelectedPlanId(currentPlanId);
        } else {
          const recommended = fetchedPlans.find((p) => p.isRecommended);

          if (recommended) {
            setSelectedPlanId(recommended.planId);
          } else if (fetchedPlans.length > 0) {
            setSelectedPlanId(fetchedPlans[0].planId);
          }
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [currentPlanId]);

  useEffect(() => {
    if (user?.subscription?.planId && processingId) {
      setProcessingId(null);
      navigate("/todos");
    }
  }, [user?.subscription?.planId, processingId, navigate]);

  const handleSelectPlan = async (planId: PlanId) => {
    try {
      setProcessingId(planId);

      if (hasActiveSubscription) {
        const res = await planService.upgradePlan({ planId });

        console.log("Plan updated successfully:", res);

        return;
      }

      const res: PlanSelectionResponse = await planService.selectPlan({
        planId,
      });

      if (res.user) {
        updateUserData(res.user);
      }

      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch (err) {
      console.error("Error updating/selecting plan:", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <PricingSkeleton />;
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {hasActiveSubscription ? "Manage Subscription" : "Plans & Pricing"}
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          {hasActiveSubscription
            ? "Review your active plan or explore options to upgrade your workspace capability."
            : "Choose a plan that fits your workflow. Upgrade, downgrade, or cancel anytime."}
        </p>
      </div>

      {hasActiveSubscription && currentPlan && (
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-primary" /> Active
                Subscription
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {currentPlan.name} Plan
              </h3>
              <h3>Status: </h3>
              <span>{user?.subscription?.status}</span>
              <p className="text-sm text-muted-foreground">
                Currently active on your account • ${currentPlan.price}
                {currentPlan.billingCycle === "monthly" ? "/month" : ""}
              </p>
            </div>

            {/* <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/5 sm:w-auto w-full self-start sm:self-center"
              onClick={() => handleSelectPlan(currentPlan.planId)}
              disabled={processingId !== null}
            >
              {processingId === currentPlan.planId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Cancel Subscription
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button> */}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlanId === plan.planId;
          const isSelected = selectedPlanId === plan.planId;
          const isProcessing = processingId === plan.planId;
          const isRecommended = Boolean(plan.isRecommended);

          return (
            <Card
              key={plan.planId}
              onClick={() => setSelectedPlanId(plan.planId)}
              className={`relative flex flex-col justify-between cursor-pointer transition-all duration-200 border-2 ${
                isCurrentPlan
                  ? "border-primary bg-primary/2 ring-2 ring-primary/20 shadow-md cursor-default"
                  : isRecommended
                    ? isSelected
                      ? "border-primary shadow-xl ring-2 ring-primary -translate-y-1"
                      : "border-primary/50 shadow-md hover:border-primary -translate-y-1"
                    : isSelected
                      ? "border-primary shadow-lg ring-1 ring-primary"
                      : "border-border hover:border-muted-foreground/40 hover:shadow-sm"
              }`}
            >
              <CardHeader className="pt-6">
                <CardTitle className="text-xl font-semibold flex items-center justify-between">
                  <span>{plan.name}</span>
                </CardTitle>

                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {typeof plan.price === "number"
                      ? `$${plan.price}`
                      : plan.price}
                  </span>
                  {plan.billingCycle === "monthly" && (
                    <span className="text-muted-foreground text-sm ml-1">
                      /month
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="text-sm font-medium mb-3 text-muted-foreground">
                  Included features:
                </div>
                <ul className="space-y-2.5 text-sm">
                  {plan.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  className="w-full"
                  variant={
                    isCurrentPlan
                      ? "outline"
                      : isRecommended || isSelected
                        ? "default"
                        : "outline"
                  }
                  disabled={isCurrentPlan || processingId !== null}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.planId);
                  }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : hasActiveSubscription ? (
                    <>
                      <Zap className="mr-1.5 h-4 w-4 fill-current" />
                      Upgrade
                    </>
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

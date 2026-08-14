import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { PricingSkeleton } from "@/components/Skeletons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { planService } from "@/api/planApi";
import type { PlanId, Plan, PlanSelectionResponse } from "@/types/Plan";
import { useAuth } from "@/context/AuthContext";

export default function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { updateUserData } = useAuth();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await planService.getPlans();
        const fetchedPlans: Plan[] = response.data || [];
        setPlans(fetchedPlans);

        const recommended = fetchedPlans.find((p) => p.isRecommended);
        if (recommended) {
          setSelectedPlanId(recommended.planId);
        } else if (fetchedPlans.length > 0) {
          setSelectedPlanId(fetchedPlans[0].planId);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (planId: PlanId) => {
    try {
      setProcessingId(planId);

      const res: PlanSelectionResponse = await planService.selectPlan({
        planId: planId,
      });

      if (res.user) {
        updateUserData(res.user);
      }

      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch (err) {
      console.error("Error selecting plan:", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <PricingSkeleton />;
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12 space-y-4">
        <Badge
          variant="outline"
          className="px-3 py-1 border-primary/30 text-primary"
        >
          Flexible Pricing
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Pick the perfect plan for your needs
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Choose a plan that fits your workflow. Upgrade, downgrade, or cancel
          anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-4">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.planId;
          const isProcessing = processingId === plan.planId;
          const isRecommended = Boolean(plan.isRecommended);

          return (
            <Card
              key={plan.planId}
              onClick={() => setSelectedPlanId(plan.planId)}
              className={`relative flex flex-col justify-between cursor-pointer transition-all duration-200 border-2 ${
                isRecommended
                  ? isSelected
                    ? "border-primary shadow-xl ring-2 ring-primary -translate-y-1"
                    : "border-primary/50 shadow-md hover:border-primary -translate-y-1"
                  : isSelected
                    ? "border-primary shadow-lg ring-1 ring-primary"
                    : "border-border hover:border-muted-foreground/40 hover:shadow-sm"
              }`}
            >
              <CardHeader className="pt-6">
                <CardTitle className="text-xl font-semibold">
                  {plan.name}
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
                  variant={isRecommended || isSelected ? "default" : "outline"}
                  disabled={processingId !== null}
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

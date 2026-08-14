import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TrialBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.subscription?.status !== "trialing") return null;

  const trialEndsAt = user.subscription.trialEndsAt;
  console.log("trialendsat", trialEndsAt);
  if (!trialEndsAt) return null;

  const endDate = new Date(trialEndsAt);
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  const warning = daysLeft <= 1;

  return (
    <div
      className={cn(
        "w-full rounded-lg border p-3.5 mb-4 flex items-center justify-between gap-3 text-sm transition-colors mt-4",
        warning
          ? "bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400"
          : "bg-muted/50 border-border text-foreground",
      )}
    >
      <div className="flex items-center gap-3">
        {warning ? (
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
        ) : (
          <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
        )}
        <div>
          <p className="font-medium leading-tight">
            Trial ends in{" "}
            <span className="font-bold decoration-primary/30">
              {daysLeft} {daysLeft === 1 ? "day" : "days"}
            </span>
          </p>
          <p
            className={cn(
              "text-xs mt-0.5",
              warning ? "text-destructive/80" : "text-muted-foreground",
            )}
          >
            Upgrade now to retain full access to premium features.
          </p>
        </div>
      </div>

      <Button
        size="sm"
        variant={warning ? "destructive" : "default"}
        onClick={() => navigate("/plans")}
        className="shrink-0 font-medium h-8 px-3 cursor-pointer"
      >
        Upgrade
      </Button>
    </div>
  );
};

export default TrialBanner;

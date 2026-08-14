import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useSubscriptionSocket } from "@/hooks/useSubscriptionSocket";
export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();

  useSubscriptionSocket((data) => {
    if (
      (data.event === "CHECKOUT_COMPLETED" ||
        data.event === "PAYMENT_SUCCESS") &&
      data.payload
    ) {
      console.log("received payload", data.payload);
      updateUserData(data.payload);
    }
  });

  const status = user?.subscription?.status ?? "";
  console.log("user status", status);
  const hasAccess = ["active", "trialing"].includes(status);
  const planDetails = user?.subscription;

  const handleContinue = () => {
    navigate("/todos");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background">
      <Card className="max-w-md w-full border-2 shadow-xl relative overflow-hidden text-center">
        <div className="h-2 w-full bg-linear-to-r from-blue-400 via-primary to-blue-200" />

        <CardHeader className="pt-8 pb-4 flex flex-col items-center">
          <Badge
            variant="outline"
            className="mb-2 px-3 py-1 border-blue-500/30 text-blue-600 dark:text-blue-500 gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {!hasAccess ? "Finalizing Payment..." : "Payment Successful!"}
          </Badge>

          <h1 className="text-2xl font-bold tracking-tight">
            {!hasAccess ? "Verifying your subscription" : "Welcome aboard!"}
          </h1>

          <p className="text-muted-foreground text-sm mt-1 max-w-xs">
            {!hasAccess
              ? "We're receiving confirmation from Stripe. This will take a moment."
              : "Your payment was processed successfully."}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-left">
          <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2.5 border border-border/50">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Account</span>
              <span className="font-medium text-foreground truncate max-w-45">
                {user?.email || "Authenticated User"}
              </span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground">
              <span>Status</span>
              <span className="font-semibold capitalize text-blue-600 dark:text-blue-500">
                {!hasAccess ? "Processing..." : planDetails?.status || "Active"}
              </span>
            </div>

            {planDetails?.planId && (
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Selected Plan</span>
                <span className="font-medium text-foreground capitalize">
                  {planDetails.planId}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Encrypted & secure Stripe checkout</span>
          </div>
        </CardContent>

        <CardFooter className="pb-8 pt-2">
          <Button
            onClick={handleContinue}
            disabled={!hasAccess}
            className="w-full h-11 text-base gap-2 bg-primary hover:bg-primary/90 transition-all shadow-md"
          >
            {!hasAccess ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Dashboard
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

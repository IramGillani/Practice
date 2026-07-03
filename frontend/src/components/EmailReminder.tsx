import { useState } from "react";
import { AlertTriangle, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export const EmailVerificationBanner = () => {
  const { handleResendEmail, user } = useAuth();
  const email = user?.email || "";
  const [isResending, setIsResending] = useState(false);

  const onResendClick = async () => {
    setIsResending(true);
    try {
      await handleResendEmail(email);
    } catch (error) {
      console.error("Failed to resend email:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/50 p-4 transition-colors">
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 sm:mt-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm font-medium">
            Please verify your email address to access all features.
            <span className="text-amber-800/80 dark:text-amber-300/80 block sm:inline sm:ml-1">
              Some features are currently restricted.
            </span>
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onResendClick}
          disabled={isResending}
          className="w-full sm:w-auto border-amber-300 dark:border-amber-800 bg-white dark:bg-amber-950 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 shrink-0 shadow-sm transition-all"
        >
          {isResending ? (
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 animate-pulse" />
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Resend Email
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

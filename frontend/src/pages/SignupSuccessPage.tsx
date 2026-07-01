import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Mail, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupSuccessPage() {
  const { handleResendEmail, user } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-lg shadow-lg p-2">
        <CardHeader className="flex flex-col items-center pt-8">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-center text-3xl font-bold tracking-tight text-foreground">
            Account Created Successfully
          </CardTitle>
          <CardDescription className="mt-2 text-center text-base max-w-sm">
            Your account has been created successfully. Before you can access
            all features, please verify your email address.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-xl border border-border bg-muted/40 p-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-primary shrink-0" />
              <div>
                <h2 className="font-semibold text-foreground">
                  Check your inbox
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We've sent you a verification email. Click the verification
                  link inside the email to activate your account.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  If you don't see it within a few minutes, be sure to check
                  your spam or junk folder.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => {
                if (user?.email) {
                  handleResendEmail(user.email);
                }
              }}
              className="w-full gap-2 py-6 text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Resend Verification Email
            </Button>

            <Button asChild className="w-full gap-2 py-6 text-sm">
              <Link to="/todos">
                Continue to Todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="pb-8 justify-center">
          <p className="text-center text-sm text-muted-foreground max-w-xs">
            You can continue using the application, but some features may remain
            unavailable until your email has been verified.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

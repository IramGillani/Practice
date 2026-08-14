import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Mail, RefreshCw, ArrowRight } from "lucide-react";
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
          <div className="rounded-full bg-warning/10 p-4 mb-4 text-warning">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-center text-3xl font-bold tracking-tight text-foreground">
            Verify Your Email
          </CardTitle>
          <CardDescription className="mt-2 text-center text-base max-w-sm">
            Your account has been created, but **access is restricted** until
            your email address is verified.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-4">
          <div className="rounded-xl border border-border bg-muted/40 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-destructive shrink-0" />
              <div>
                <h2 className="font-semibold text-foreground">
                  Activation Required
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We've sent a verification link to your email. You must click
                  this link to activate your account and gain access to the
                  application.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Can't find it? Check your spam or junk folder just in case.
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
              <Link to="/login">
                Already Verified? Go to Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

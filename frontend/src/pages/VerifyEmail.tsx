import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { handleResendEmail } = useAuth();

  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const [message, setMessage] = useState("");
  const email = searchParams.get("email") || "";

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token") || "";

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await authService.verifyEmail({ token, email });

        setStatus("success");

        setMessage(res.message!);
      } catch (err: any) {
        setStatus("error");

        if (err?.response?.data?.message) {
          setMessage(err.response.data.message);
        } else if (typeof err === "string") {
          setMessage(err);
        } else if (err?.message) {
          setMessage(err.message);
        } else {
          setMessage("Verification failed. Please try again.");
        }
      }
    };

    verify();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-md shadow-lg transition-all">
        {status === "loading" && (
          <CardContent className="flex flex-col items-center justify-center pt-10 pb-10 space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h2 className="text-xl font-semibold text-foreground">
              Verifying your email
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we validate your secure token...
            </p>
          </CardContent>
        )}

        {status === "success" && (
          <>
            <CardHeader className="flex flex-col items-center pt-8">
              <div className="rounded-full bg-emerald-500/10 p-4 mb-2">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
              <CardTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
                Email Verified!
              </CardTitle>
              <CardDescription className="text-center text-sm">
                {message}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pb-8 flex flex-col items-center gap-2">
              <Button
                asChild
                variant="link"
                className="mt-2 text-primary gap-1"
              >
                <Link to="/todos">
                  Cotinue to Todos
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </>
        )}

        {status === "error" && (
          <>
            <CardHeader className="flex flex-col items-center pt-8">
              <div className="rounded-full bg-destructive/10 p-4 mb-2">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-center text-2xl font-bold tracking-tight text-foreground">
                Verification Failed
              </CardTitle>
              <CardDescription className="text-center text-sm text-destructive font-medium max-w-xs mt-1">
                {message}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 space-y-3">
              <Button
                variant="outline"
                disabled={!email}
                onClick={() => handleResendEmail(email)}
                className="w-full gap-2 py-6 text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Resend Verification Email
              </Button>
              <Button asChild variant="ghost" className="w-full text-sm">
                <Link to="/login">Back to Sign In</Link>
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}

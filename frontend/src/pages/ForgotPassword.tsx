import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { authService } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import SuccessPage from "@/components/SuccessPage";

const forgotSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Please enter your email address")
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
});

type ForgotFormValues = yup.InferType<typeof forgotSchema>;

export const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<ForgotFormValues>({
    resolver: yupResolver(forgotSchema),
    mode: "onTouched",

    defaultValues: {
      email: "",
    },
  });
  const { isSubmitting } = form.formState;
  const onSubmit = async (data: ForgotFormValues) => {
    try {
      const response = await authService.forgotPassword(
        data.email.toLowerCase(),
      );
      form.reset();
      setSuccessMessage(
        response.message ??
          "If an account exists, we've sent a password reset link.",
      );
      setIsSubmitted(true);
    } catch (err: unknown) {
      console.log("forgot password error", err);
    }
  };

  if (isSubmitted) {
    return (
      <SuccessPage
        heading="Check Your Inbox"
        buttonLink="login"
        buttonText="Login"
        desc={successMessage}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 border rounded-lg shadow-sm bg-card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Forgot Password</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="min-h-21">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Email
                    </FormLabel>

                    <FormControl>
                      <Input
                        autoFocus
                        type="text"
                        autoComplete="email"
                        disabled={isSubmitting}
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage name="email" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm mt-4">
          <Link
            to="/login"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

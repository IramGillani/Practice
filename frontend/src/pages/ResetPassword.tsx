import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PasswordField } from "@/components/PasswordField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import SuccessPage from "@/components/SuccessPage";
import { authService } from "@/api/authApi";

const resetSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

type ResetFormValues = yup.InferType<typeof resetSchema>;

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [success, setSuccess] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: yupResolver(resetSchema),

    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ResetFormValues) => {
    if (!token || !email) {
      return;
    }

    try {
      await authService.resetPassword({
        email,
        token,
        password: data.password,
      });
      setSuccess(true);
    } catch (err: unknown) {
      console.log(err);
    } finally {
    }
  };

  if (success) {
    return (
      <SuccessPage
        heading="Credentials Updated"
        desc="Your password has been changed. You may now return to sign in safely."
        buttonText="Login"
        buttonLink="/login"
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 border rounded-lg shadow-sm bg-card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Reset Password</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create a new password for your account.
          </p>
        </div>

        {(!token || !email) && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
            Warning: The payload context link configuration appears invalid or
            truncated.
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              {" "}
              <PasswordField
                control={form.control}
                name="password"
                label="New Password"
              />
              <PasswordField
                control={form.control}
                name="confirmPassword"
                label="Confirm New Password"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !token || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity=".25"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                  Updating...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

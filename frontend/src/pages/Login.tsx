import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { authService } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { loginSchema, type LoginFormValues } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    try {
      const response = await authService.login(data as LoginFormValues);
      console.log("Login successful:", response);
      login(response.user, response.accessToken, response.refreshToken);
      navigate("/todos");
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 404) {
        setServerError("Account not found. Redirecting to signup...");
        setTimeout(() => navigate("/signup"), 2000);
      } else if (status === 401) {
        setServerError("Invalid credentials. Please try again.");
      } else {
        setServerError(
          error.response?.data?.message || "An unexpected error occurred.",
        );
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm bg-card">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage name="email" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage name="password" />
                </FormItem>
              );
            }}
          />

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
}

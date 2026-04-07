import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

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
import { loginSchema, type LoginFormValues, type User } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useAuth();

  // const onSubmit = (data: AuthFormValues) => {
  //   setServerError(null);

  //   const users = JSON.parse(localStorage.getItem("users") || "[]");

  //   const user = users.find(
  //     (u: AuthFormValues) =>
  //       u.email === data.email && u.password === data.password,
  //   );

  //   if (user) {
  //     localStorage.setItem("currentUser", JSON.stringify(user));
  //     navigate("/todos");
  //   } else {
  //     const emailExists = users.some((u: any) => u.email === data.email);

  //     if (!emailExists) {
  //       navigate("/signup");
  //     } else {
  //       setServerError("Invalid credentials. Please try again.");
  //     }
  //   }
  // };

  const onSubmit = (data: LoginFormValues) => {
    setServerError(null);
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    console.log("Users in localStorage:", users);
    const foundUser = users.find(
      (u: User) => u.email === data.email && u.password === data.password,
    );

    if (foundUser) {
      login(foundUser);
      navigate("/todos");
    } else {
      const emailExists = users.some((u: User) => u.email === data.email);
      console.log("Email exists:", emailExists);

      if (!emailExists) {
        setServerError("Account not found. Redirecting to signup...");
        setTimeout(() => navigate("/signup"), 8000);
        navigate("/signup");
      } else {
        setServerError("Invalid credentials. Please try again.");
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
                    type="email"
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

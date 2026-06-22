import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { PasswordField } from "@/components/PasswordField";
import { SocialLoginButton } from "@/components/SocialLoginBtn";

export function LoginForm() {
  const navigate = useNavigate();
  const { handleSocialLogin } = useAuth();

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
    try {
      const response = await authService.login(data as LoginFormValues);
      console.log("Login successful:", response);
      login(response.user, response.accessToken, response.refreshToken);
      navigate("/todos");
    } catch (error: any) {}
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm bg-card">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      type="text"
                      placeholder="email@example.com"
                      {...field}
                      className="mb-0"
                    />
                  </FormControl>
                  <FormMessage name="email" />
                </FormItem>
              )}
            />
          </div>

          <PasswordField
            control={form.control}
            name="password"
            label="Password"
          />

          <Button type="submit" className="w-full hover:cursor-pointer">
            Sign In
          </Button>
          <div className="relative my-4 flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <span className="relative bg-card px-3 text-xs uppercase text-muted-foreground">
              Or
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin("google")}
            />
            <SocialLoginButton
              provider="github"
              onClick={() => handleSocialLogin("github")}
            />
          </div>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              to="/signup"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

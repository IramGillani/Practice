import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/api/authApi";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/PasswordField";
import { SocialLoginButton } from "@/components/SocialLoginBtn";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signupSchema, type SignupFormValues } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function Signup() {
  const { handleSocialLogin } = useAuth();
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await authService.signup(data);
      console.log("✅ Signup successful:", response);
      login(response.user, response.accessToken, response.refreshToken);

      navigate("/todos");
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 409) {
        form.setError("email", {
          message: "This email is already registered.",
        });
      } else {
        form.setError("root", {
          message:
            error.response?.data?.message ||
            "Something went wrong during registration.",
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-card">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="min-h-20">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      {...field}
                      className="mb-0"
                    />
                  </FormControl>
                  <FormMessage name="name" />
                </FormItem>
              )}
            />
          </div>
          <div className="min-h-20">
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
                      placeholder="Email"
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
          <Button type="submit" className="w-full">
            Register
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
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </Button>
        </form>
      </Form>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/api/authApi";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signupSchema, type SignupFormValues, type User } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function Signup() {
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
      login(response.user, response.accessToken, refreshToken);

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage name="name" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage name="email" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage name="password" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Register
          </Button>
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

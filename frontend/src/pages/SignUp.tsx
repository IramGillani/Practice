import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (data: SignupFormValues) => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (existingUsers.find((u: User) => u.email === data.email)) {
      form.setError("email", { message: "Email already registered" });
      return;
    }

    const updatedUsers = [...existingUsers, data];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    login(data as User);
    navigate("/todos");
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
                  <Input type="email" placeholder="Email" {...field} />
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

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userService } from "@/api/userApi";

const settingsSchema = yup
  .object({
    name: yup.string().min(2, "Name is too short").optional(),
    currentPassword: yup.string().when("newPassword", {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema.required("Current password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    newPassword: yup
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .min(6, "Password must be at least 6 characters")
      .optional(),

    confirmPassword: yup.string().when("newPassword", {
      is: (val: string) => val && val.length > 0,
      then: (schema) =>
        schema
          .oneOf([yup.ref("newPassword")], "Passwords must match")
          .required("Please confirm your password"),
      otherwise: (schema) => schema.notRequired(),
    }),
    profile: yup.mixed().optional(),
  })
  .required();

type SettingsFormValues = yup.InferType<typeof settingsSchema>;

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { updateUserData, user } = useAuth();

  const form = useForm<SettingsFormValues>({
    resolver: yupResolver(settingsSchema) as any,
    defaultValues: {
      name: user?.name || "",
      profile: user?.profileUrl || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, dirtyFields } = form.formState;

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      if (Object.keys(dirtyFields).length === 0) {
        toast.info("No changes detected.");
        return;
      }

      const formData = new FormData();

      Object.keys(dirtyFields).forEach((key) => {
        const value = data[key as keyof SettingsFormValues];

        if (value && key !== "confirmPassword") {
          formData.append(key, value as string | Blob);
        }
      });
      console.log(
        "Submitting form data:",
        Object.fromEntries(formData.entries()),
      );

      const response = await userService.updateInfo(formData);
      console.log("Update response:", response);

      updateUserData(response.user);
      toast.success("Settings updated successfully!");
      form.reset(data, { keepValues: true });
    } catch (error) {
      toast.error("Failed to update settings.");
    }
  };
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 -ml-3 "
      >
        <ArrowLeft size={16} />
        Back
      </Button>{" "}
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold ">Account Settings</h1>
        <p className="mb-6 mt-1 text-gray-600">
          Update your account information below
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage name="name" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile URL</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                      className="text-gray-600 "
                    />
                  </FormControl>
                  <FormMessage name="profile" />
                </FormItem>
              )}
            />

            <div className="grid grid-rows-3 gap-4 border-t pt-4 mt-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage name="currentPassword" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage name="newPassword" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage name="confirmPassword" />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update Settings"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default SettingsPage;

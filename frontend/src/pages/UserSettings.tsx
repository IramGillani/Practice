import { useState, useRef, useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "@/components/PasswordField";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Camera, User } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userService } from "@/api/userApi";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

const settingsSchema = yup.object({
  name: yup.string().min(2, "Name is too short").optional(),
  currentPassword: yup
    .string()

    .when("newPassword", {
      is: (val: string) => val && val.length > 0,
      then: (schema) =>
        schema
          .required("Current password is required")
          .min(6, "Password must be at least 6 characters"),
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
});

type SettingsFormValues = yup.InferType<typeof settingsSchema>;

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { updateUserData, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profileUrl || null,
  );
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: yupResolver(settingsSchema),
    mode: "onTouched",
    defaultValues: {
      name: user?.name || "",
      profile: user?.profileUrl || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, dirtyFields } = form.formState;

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file.");
      return;
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

    form.setValue("profile", file, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setImagePreview((prev) => {
      if (prev?.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return URL.createObjectURL(file);
    });
    // console.log("Preview Url", previewUrl);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // console.log("DataTransfer obj", e.dataTransfer.files);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      if (Object.keys(dirtyFields).length === 0) {
        toast.info("No changes detected.");
        return;
      }
      if (data.currentPassword && !data.newPassword) {
        toast.error("Please enter a new password to update your credentials.");
        return;
      }

      const formData = new FormData();

      Object.keys(dirtyFields).forEach((key) => {
        const value = data[key as keyof SettingsFormValues];
        if (value && key !== "confirmPassword") {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await userService.updateInfo(formData);
      updateUserData(response.user);

      form.reset({
        name: response.user.name || "",
        profile: response.user.profileUrl || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      // toast.error("Failed to update settings.");
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleCancel = () => {
    form.reset({
      name: user?.name || "",
      profile: user?.profileUrl || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setImagePreview(user?.profileUrl || null);
    setIsDragging(false);

    toast.info("Changes discarded.");
  };

  return (
    <>
      <header className="flex flex-col p-6 mb-8 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 self-start border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <ArrowLeft size={16} />
          Back
        </Button>{" "}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update your profile details and security configurations.
          </p>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto py-6 px-4 md:px-0 bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 divide-y divide-slate-200 dark:divide-slate-800"
          >
            {/* Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-5">
                <Avatar
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`group relative w-28 h-28 rounded-full border bg-slate-50 dark:bg-slate-900 overflow-hidden cursor-pointer shadow-inner shrink-0 transition-all duration-200 ${
                    isDragging
                      ? "border-blue-500 scale-105 ring-4 ring-blue-500/20"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <AvatarImage
                    src={imagePreview || ""}
                    alt="Profile Preview"
                    className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processFile(file);
                    }}
                    accept="image/*"
                    className="hidden"
                  />

                  <AvatarFallback className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <User
                      size={32}
                      className="text-slate-400 dark:text-slate-500"
                    />
                  </AvatarFallback>

                  <div
                    className={`absolute inset-0 bg-slate-900/40 dark:bg-black/50 flex items-center justify-center transition-opacity duration-150 ${
                      isDragging
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Camera className="text-white w-5 h-5" />
                  </div>
                </Avatar>

                <div className="space-y-0.5">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {user?.name || "User Name"}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {user?.email || "user@example.com"}
                  </p>
                  <FormMessage name="profile" className="mt-1" />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-6">
              <div>
                <h2 className="text-base font-semibold">Personal Info</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Change your user profile name context.
                </p>
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="relative ">
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                        Full Name
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className=" border-slate-200 dark:border-slate-800 focus-visible:bg-white dark:focus-visible:bg-slate-950 focus-visible:ring-blue-500 mb-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage
                        name="name"
                        className="absolute left-0 top-full mt-1"
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div>
                <h2 className="text-base font-semibold">Update Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Keep your workspace secure by assigning an updated credential.
                </p>
              </div>
              <div className="md:col-span-2">
                <PasswordField
                  control={form.control}
                  name="currentPassword"
                  label="Current Password"
                />

                <PasswordField
                  control={form.control}
                  name="newPassword"
                  label="New Password"
                />

                <PasswordField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm New Password"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-8 mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="px-5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors duration-150"
                disabled={isSubmitting || Object.keys(dirtyFields).length === 0}
              >
                {isSubmitting ? "Saving Updates..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
};

export default SettingsPage;

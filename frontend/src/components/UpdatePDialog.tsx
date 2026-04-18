import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
// import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userService } from "@/api/userApi";

import { passwordSchema, type PasswordFormValues } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdatePasswordDialog = ({ isOpen, onOpenChange }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      await userService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      //   toast.success("Password updated successfully");
      console.log("updated successfully");
      reset(); // Clear form
      onOpenChange(false);
    } catch (err: any) {
      console.log("Failed to update password");
      //   toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>
            Enter your current password and set a new password to update your
            account credentials.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Current Password"
              {...register("currentPassword")}
              className={errors.currentPassword ? "border-red-500" : ""}
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              placeholder="New Password"
              {...register("newPassword")}
              className={errors.newPassword ? "border-red-500" : ""}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

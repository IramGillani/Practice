import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";

interface PasswordFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
}

export const PasswordField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "••••••",
}: PasswordFieldProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-22">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
              {label}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                  className=" border-slate-200 dark:border-slate-800 focus-visible:bg-white dark:focus-visible:bg-slate-950 pr-10 focus-visible:ring-blue-500 mb-0"
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-0 h-full w-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-transparent active:bg-transparent"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </FormControl>
            <FormMessage name={name} className="my-1" />
          </FormItem>
        )}
      />
    </div>
  );
};

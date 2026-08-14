import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { onboardingService } from "@/api/onBoarding";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import * as yup from "yup";

import type { OnboardingFormData } from "@/types";

export const onboardingSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Organization name is required")
    .min(2, "Name must be at least 2 characters"),
  url: yup
    .string()
    .trim()
    .transform((value) => (value === "" || !value ? "" : value))
    .test(
      "is-valid-url",
      "Please enter a valid URL (e.g., https://example.com)",
      (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
    )
    .default(""),
  teamSize: yup
    .string()
    .oneOf(["1", "2-10", "11+"] as const, "Please select a valid team size")
    .required("Please select your team size"),
});

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserData } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: yupResolver(
      onboardingSchema,
    ) as unknown as Resolver<OnboardingFormData>,
    mode: "onChange",
    defaultValues: {
      name: "",
      url: "",
      teamSize: "",
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      const payload: OnboardingFormData = {
        ...data,
        url: data.url || "",
      };

      const response = await onboardingService.submitOnboarding(payload);
      const { user } = response;

      updateUserData(user);

      navigate("/plans");
    } catch (err: any) {
      console.log(err);
    }
  };

  const selectedTeamSize = watch("teamSize");

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Welcome! Let's get started
          </CardTitle>
          <CardDescription>
            Tell us a bit about your organization.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-1">
              <Label htmlFor="name">
                Organization Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Acme Corp"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              <div className="h-5">
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="url">
                Website URL{" "}
                <span className="text-muted-foreground text-xs">
                  (Optional)
                </span>
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                {...register("url")}
                aria-invalid={!!errors.url}
              />
              <div className="h-5">
                {errors.url && (
                  <p className="text-xs text-destructive">
                    {errors.url.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="teamSize">
                Team Size <span className="text-destructive">*</span>
              </Label>

              <div className="relative">
                <select
                  id="teamSize"
                  {...register("teamSize")}
                  aria-invalid={!!errors.teamSize}
                  className={`flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8 ${
                    !selectedTeamSize
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  <option value="" disabled hidden>
                    Select team size
                  </option>
                  <option value="1" className="text-foreground bg-popover">
                    1 person (Solo)
                  </option>
                  <option value="2-10" className="text-foreground bg-popover">
                    2–10 team members
                  </option>
                  <option value="11+" className="text-foreground bg-popover">
                    11+ team members
                  </option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground">
                  <svg
                    className="h-4 w-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="h-5">
                {errors.teamSize && (
                  <p className="text-xs text-destructive">
                    {errors.teamSize.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

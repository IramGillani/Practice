export interface SignupProps {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  stripeCustomerId: string;
}
export interface LoginProps {
  email: string;
  password: string;
}

export interface VerifyEmailProps {
  token: string;
  email: string;
}

export interface ResetPasswordProps {
  token: string;
  email: string;
  password: string;
}

export enum EmailType {
  PASSWORD_RESET = "PASSWORD_RESET",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

export interface EmailParams {
  email: string;
  rawToken: string;
  type: EmailType;
  route: string;
}

export type TeamSize = "1" | "2-10" | "10+";

export type OnboardingFormData = {
  name: string;
  url: string;
  teamSize: TeamSize;
};

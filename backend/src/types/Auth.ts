export interface SignupProps {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
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

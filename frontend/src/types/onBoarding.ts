import type { User } from "./Auth";
export type TeamSize = "1" | "2-10" | "11+" | "";

export type OnboardingFormData = {
  name: string;
  url: string;
  teamSize: TeamSize;
};
export interface OnboardingResponse {
  user: User;
}

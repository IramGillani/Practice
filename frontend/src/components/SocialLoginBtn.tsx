import type { Provider } from "@/types";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button";
export function SocialLoginButton({
  provider,
  onClick,
}: {
  provider: Provider;
  onClick: () => void;
}) {
  const config = {
    google: {
      label: "Google",
      icon: FcGoogle,
    },
    github: {
      label: "GitHub",
      icon: FaGithub,
    },
  };

  const { label, icon: Icon } = config[provider];

  return (
    <Button
      onClick={onClick}
      type="button"
      aria-label={`Sign in with ${label}`}
      className="text-black dark:text-white bg-transparent cursor-pointer border border-gray-200 dark:border-white/60 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
    >
      <Icon />
      Continue with {label}
    </Button>
  );
}

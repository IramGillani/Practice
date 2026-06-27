import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import type { SuccessPageProps } from "@/types";
const SuccessPage = ({
  heading,
  desc,
  buttonText,
  buttonLink,
}: SuccessPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 p-8 bg-white border border-gray-200 shadow-xl rounded-xl text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <Check
            aria-hidden="true"
            className="h-6 w-6 text-green-600 dark:text-green-400"
          />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">{heading}</h1>
        <p className="text-sm text-gray-600">{desc}</p>
        <Link
          to={`/${buttonLink}`}
          className="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Go to {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;

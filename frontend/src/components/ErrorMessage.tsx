import { useEffect } from "react";
import { useTask } from "@/context/TaskProvider";

export const ErrorMessage = () => {
  const { state, dispatch } = useTask();

  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_ERROR" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.error, dispatch]);

  if (!state.error) return null;

  return (
    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 flex justify-between items-center animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="flex items-center">
        <span className="text-red-700 text-sm font-medium">{state.error}</span>
      </div>
      <button
        onClick={() => dispatch({ type: "CLEAR_ERROR" })}
        className="text-red-500 hover:text-red-800 font-bold transition-colors"
      >
        &times;
      </button>
    </div>
  );
};

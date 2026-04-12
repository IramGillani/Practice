import React, { createContext, useReducer, useEffect, useContext } from "react";
import type { TaskState } from "@/types";
import { taskReducer } from "./TaskReducer";
import { taskService } from "@/api/taskApi";
import { type TaskAction } from "./TaskReducer";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

const initialState: TaskState = {
  tasks: [],
  filter: "all",
  sortOrder: "newest",
  editingId: null,
  isLoading: true,
  error: null,
  // isLoading: false,
  // error: "Error happened",
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: "SET_TASKS", payload: [] });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const init = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const data = await taskService.getAll();
        dispatch({ type: "SET_TASKS", payload: data });
      } catch (err) {
        console.error("Initialization error:", err);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load tasks from server.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    init();
  }, [isAuthenticated]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

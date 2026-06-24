import React, { createContext, useReducer, useEffect, useContext } from "react";
import type { TaskState } from "@/types";
import { taskReducer } from "./TaskReducer";
import { taskService } from "@/api/taskApi";
import { type TaskAction } from "./TaskReducer";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  loadMoreTasks: () => Promise<void>;
}

const initialState: TaskState = {
  tasks: [],
  filter: "all",
  sortOrder: "newest",
  editingId: null,
  isLoading: true,
  error: null,
  hasMore: true,
  isFetchingMore: false,
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const PAGE_SIZE = 6;

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: "SET_TASKS", payload: [] });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_HAS_MORE", payload: true });
      return;
    }

    const init = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const data = await taskService.getAll(PAGE_SIZE, 0);

        dispatch({ type: "SET_TASKS", payload: data.tasks });
        dispatch({ type: "SET_HAS_MORE", payload: data.hasMore });
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

  const loadMoreTasks = async () => {
    if (state.isFetchingMore || !state.hasMore) return;

    try {
      dispatch({ type: "SET_FETCHING_MORE", payload: true });
      const currentSkip = state.tasks.length;
      const data = await taskService.getAll(PAGE_SIZE, currentSkip);

      dispatch({ type: "APPEND_TASKS", payload: data.tasks });
      dispatch({ type: "SET_HAS_MORE", payload: data.hasMore });
    } catch (err) {
      console.error("Error loading more tasks:", err);
    } finally {
      dispatch({ type: "SET_FETCHING_MORE", payload: false });
    }
  };

  return (
    <TaskContext.Provider value={{ state, dispatch, loadMoreTasks }}>
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

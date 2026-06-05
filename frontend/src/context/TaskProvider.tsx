import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
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
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: "SET_TASKS", payload: [] });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_LOADING", payload: false });
      setHasMore(true);
      return;
    }

    const init = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const data = await taskService.getAll(6, 0);
        console.log("Initial tasks loaded:", data);
        dispatch({ type: "SET_TASKS", payload: data.tasks });
        setHasMore(data.hasMore);
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
    if (isFetchingMore || !hasMore) return;

    try {
      setIsFetchingMore(true);
      const currentSkip = state.tasks.length;
      const data = await taskService.getAll(6, currentSkip);
      console.log("Loaded more tasks:", data);
      dispatch({ type: "APPEND_TASKS", payload: data.tasks });
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Error loading more tasks:", err);
    } finally {
      setIsFetchingMore(false);
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

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import type { Task, TaskState } from "@/types";
import { taskReducer } from "./TaskReducer";
import { taskService } from "@/api/taskApi";
import { processedTasks } from "@/utils";

const initialState: TaskState = {
  tasks: [],
  filter: "all",
  sortOrder: "newest",
  editingId: null,
  isLoading: true,
};

const TaskStateContext = createContext<TaskState | null>(null);
const TaskDispatchContext = createContext<React.Dispatch<any> | null>(null);
const FilteredTasksContext = createContext<Task[] | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  useEffect(() => {
    const initTasks = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const data = await taskService.getAll();
        dispatch({ type: "SET_TASKS", payload: data });
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    initTasks();
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("todo-tasks", JSON.stringify(state.tasks));
  // }, [state.tasks]);

  const filteredTasks = useMemo(() => {
    return processedTasks(state.tasks, state.filter, state.sortOrder);
  }, [state.tasks, state.filter, state.sortOrder]);

  return (
    <TaskDispatchContext.Provider value={dispatch}>
      <TaskStateContext.Provider value={state}>
        <FilteredTasksContext.Provider value={filteredTasks}>
          {children}
        </FilteredTasksContext.Provider>
      </TaskStateContext.Provider>
    </TaskDispatchContext.Provider>
  );
};

export const useTaskState = () => {
  const context = useContext(TaskStateContext);
  if (!context)
    throw new Error("useTaskState must be used within TaskProvider");
  return context;
};

export const useTaskDispatch = () => {
  const context = useContext(TaskDispatchContext);
  if (!context)
    throw new Error("useTaskDispatch must be used within TaskProvider");
  return context;
};

export const useFilteredTasks = () => {
  const context = useContext(FilteredTasksContext);
  if (!context)
    throw new Error("useFilteredTasks must be used within TaskProvider");
  return context;
};

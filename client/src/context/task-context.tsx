"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { Task, TaskState } from "@/types";
import { taskReducer } from "./task-reducer";

const initialState: TaskState = {
  tasks: [],
  filter: "all",
  sortOrder: "newest",
  editingId: null,
};

const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<any>;
  filteredTasks: Task[];
} | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState, () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todo-tasks");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialState,
          tasks: parsed.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          })),
        };
      }
    }
    return initialState;
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  // Optimized Computed State
  const filteredTasks = useMemo(() => {
    let result = [...state.tasks];

    if (state.filter === "active") result = result.filter((t) => !t.completed);
    if (state.filter === "completed")
      result = result.filter((t) => t.completed);

    return result.sort((a, b) => {
      const timeA = a.createdAt.getTime();
      const timeB = b.createdAt.getTime();
      return state.sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [state.tasks, state.filter, state.sortOrder]);

  const value = useMemo(
    () => ({ state, dispatch, filteredTasks }),
    [state, filteredTasks],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

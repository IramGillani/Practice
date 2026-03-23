import { createContext } from "react";
export type FilterStatus = "all" | "completed" | "active";
export type SortOrder = "newest" | "oldest";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  input: string;
  updating: boolean;
  setInput: (val: string) => void;

  addTask: (text: string) => void;

  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  startEditing: (task: Task) => void;
  filter: FilterStatus;
  sortOrder: SortOrder;
  setFilter: (filter: FilterStatus) => void;
  setSortOrder: (order: SortOrder) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

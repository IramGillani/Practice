import {
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { Task, FilterStatus, TaskContextType, SortOrder } from "../types";
import { processedTasks } from "../utils";
import { TaskContext } from "../types";
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const addTask = (text: string) => {
    if (updating && editingId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, text } : t)),
      );
      setUpdating(false);
      setEditingId(null);
      setInput(""); // Reset internal string
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date(),
      };
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const startEditing = useCallback((task: Task) => {
    setUpdating(true);
    setEditingId(task.id);
    setInput(task.text);
  }, []);

  const filteredTasks = useMemo(
    () => processedTasks(tasks, filter, sortOrder),
    [tasks, filter, sortOrder],
  );

  const value: TaskContextType = {
    tasks,
    filteredTasks,
    input,
    updating,
    setInput,
    addTask,
    toggleTask,
    deleteTask,
    startEditing,
    filter,
    sortOrder,
    setFilter,
    setSortOrder,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

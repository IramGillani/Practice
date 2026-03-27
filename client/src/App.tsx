"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { TaskItem } from "./components/TaskItem";
import { DeleteModal } from "./components/DeleteModal";
import TaskInput from "./components/TaskInput";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";

// Import your new context hook and types
import { useTasks } from "@/context/task-context";
import type { FilterStatus } from "./types";

const TodoApp = () => {
  // 1. Consume the context
  const { state, dispatch, filteredTasks } = useTasks();
  const { filter, sortOrder, tasks } = state;

  // 2. Keep only "UI-only" state here (Modals, etc.)
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  // Helper to find the task text for the delete modal
  const taskToDelete = tasks.find((t) => t.id === taskToDeleteId);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
        Task Manager
      </h1>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-4 border-b">
        <div className="flex bg-gray-100 rounded-md p-1">
          {(["all", "active", "completed"] as FilterStatus[]).map((status) => (
            <Button
              key={status}
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "SET_FILTER", payload: status })}
              className={cn(
                "capitalize transition-all px-3 h-8 font-medium",
                "text-muted-foreground hover:text-foreground hover:bg-transparent",
                filter === status &&
                  "bg-background text-blue-600 shadow-sm hover:bg-background",
              )}
            >
              {status}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            dispatch({
              type: "SET_SORT",
              payload: sortOrder === "newest" ? "oldest" : "newest",
            })
          }
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-blue-600 hover:bg-transparent px-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="capitalize">{sortOrder}</span>
        </Button>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={() => setTaskToDeleteId(task.id)}
            onToggle={() => dispatch({ type: "TOGGLE_TASK", payload: task.id })}
            onEdit={() => dispatch({ type: "START_EDIT", payload: task.id })}
          />
        ))}
      </ul>

      {filteredTasks.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No tasks found.</p>
      )}

      {/* Input Section */}
      <TaskInput />

      {/* Modals */}
      {taskToDeleteId && (
        <DeleteModal
          taskText={taskToDelete?.text || ""}
          onConfirm={() => {
            dispatch({ type: "DELETE_TASK", payload: taskToDeleteId });
            setTaskToDeleteId(null);
          }}
          onCancel={() => setTaskToDeleteId(null)}
        />
      )}
    </div>
  );
};

export default TodoApp;

import { useMemo, useState, useCallback } from "react";
import { ArrowUpDown } from "lucide-react";
import { TaskItem } from "./components/TaskItem";
import { DeleteModal } from "./components/DeleteModal";
import TaskInput from "./components/TaskInput";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import { ErrorMessage } from "./components/ui/ErrorMessage";

import { useTask } from "@/context/TaskProvider";
import { processedTasks } from "@/utils";
import type { FilterStatus } from "./types";
import { taskService } from "./api/taskApi";

const TodoApp = () => {
  const { state, dispatch } = useTask();
  const { tasks, filter, sortOrder, isLoading } = state;

  const filteredTasks = useMemo(
    () => processedTasks(tasks, filter, sortOrder),
    [tasks, filter, sortOrder],
  );

  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  const openDeleteModal = useCallback((id: string) => {
    setTaskToDeleteId(id);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!taskToDeleteId) return;
    try {
      await taskService.delete(taskToDeleteId);
      dispatch({ type: "DELETE_TASK", payload: taskToDeleteId });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "SET_ERROR",
        payload: "Server communication failed. Could not delete task.",
      });
    } finally {
      setTaskToDeleteId(null);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await taskService.update(id, { completed: !currentStatus });
      dispatch({ type: "TOGGLE_TASK", payload: id });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to update task status.",
      });
    }
  };

  const taskToDelete = tasks.find((t) => t._id === taskToDeleteId);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
        Task Manager
      </h1>
      <ErrorMessage />
      {isLoading ? (
        <div className="text-xl text-center py-8 px-12">Loading tasks...</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-4 border-b">
            <div className="flex bg-gray-100 rounded-md p-1">
              {(["all", "active", "completed"] as FilterStatus[]).map(
                (status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      dispatch({ type: "SET_FILTER", payload: status })
                    }
                    className={cn(
                      "capitalize transition-all px-3 h-8 font-medium",
                      "text-muted-foreground hover:text-foreground hover:bg-transparent",
                      filter === status &&
                        "bg-background text-blue-600 shadow-sm",
                    )}
                  >
                    {status}
                  </Button>
                ),
              )}
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
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-blue-600"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="capitalize">{sortOrder}</span>
            </Button>
          </div>

          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                dispatch={dispatch}
                onDeleteTrigger={openDeleteModal}
                onToggle={() => handleToggle(task._id, task.completed)}
              />
            ))}
          </ul>

          {filteredTasks.length === 0 && (
            <p className="text-center text-gray-400 mt-10">No tasks found.</p>
          )}

          <TaskInput />

          {taskToDeleteId && (
            <DeleteModal
              taskText={taskToDelete?.text || ""}
              onConfirm={handleDeleteConfirm}
              onCancel={() => setTaskToDeleteId(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TodoApp;

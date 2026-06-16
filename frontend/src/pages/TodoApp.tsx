import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";

import { TaskItem } from "@/components/TaskItem";
import DeleteConfirmationModal from "@/components/DeleteModal";
import TaskInput from "@/components/TaskInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@/components/ErrorMessage";

import { useTask } from "@/context/TaskProvider";
import { processedTasks } from "@/utils";
import type { FilterStatus } from "@/types";
import { taskService } from "@/api/taskApi";
import { TaskSkeleton } from "@/components/Skeletons";

const TodoApp = () => {
  const { state, dispatch, loadMoreTasks } = useTask();
  const { tasks, filter, sortOrder, isLoading, hasMore, isFetchingMore } =
    state;

  const filteredTasks = useMemo(
    () => processedTasks(tasks, filter, sortOrder),
    [tasks, filter, sortOrder],
  );

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetchingMore &&
          !isLoading
        ) {
          loadMoreTasks();
        }
      },
      {
        root: null,
        rootMargin: "150px",
      },
    );
    observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, isFetchingMore, isLoading, loadMoreTasks]);

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
    <div className="max-w-md mx-auto mt-10 p-6 pt-0 bg-background text-foreground border border-border rounded-xl shadow-lg flex flex-col max-h-[80vh]">
      <div className="pt-4 pb-4 border-b border-border bg-background">
        <h1 className="text-center text-2xl font-bold text-foreground mb-4">
          Task Manager
        </h1>
        {/* <ErrorMessage /> */}
        <TaskInput />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-2">
          <div className="flex bg-muted rounded-md p-1">
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
                      "bg-background text-primary shadow-sm font-semibold",
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
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="capitalize">{sortOrder}</span>
          </Button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto [scrollbar-gutter:stable] pt-4 pr-1 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-muted/40
  [&::-webkit-scrollbar-thumb]:bg-muted-foreground/40
  [&::-webkit-scrollbar-thumb]:rounded-b-md

  hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/60"
      >
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {filteredTasks.length > 0 ? (
              <ul className="space-y-3 mb-2">
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
            ) : (
              <div className="text-center py-10 border border-dashed border-border rounded-lg my-2">
                <p className="text-sm text-muted-foreground">
                  No {filter !== "all" ? filter : ""} tasks found.
                </p>
              </div>
            )}

            <div ref={observerTarget} className="h-1" />

            {isFetchingMore && (
              <div className="space-y-3 mt-3 mb-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <TaskSkeleton key={i} />
                ))}
              </div>
            )}

            <DeleteConfirmationModal
              isOpen={!!taskToDeleteId}
              onClose={() => setTaskToDeleteId(null)}
              onConfirm={handleDeleteConfirm}
              title="Delete Task"
              description={
                taskToDelete
                  ? `Are you sure you want to delete "${taskToDelete.text}"? This action cannot be undone.`
                  : "Are you sure you want to delete this task?"
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TodoApp;

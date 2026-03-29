import { memo } from "react";
import { CheckCircle, Circle, FilePen, Trash2 } from "lucide-react";
import { type Task } from "../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TaskItem = memo(
  ({
    task,
    dispatch,
    onDeleteTrigger,
  }: {
    task: Task;
    dispatch: React.Dispatch<any>;
    onDeleteTrigger: (id: string) => void;
  }) => {
    return (
      <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group transition-all">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => dispatch({ type: "TOGGLE_TASK", payload: task.id })}
          >
            {task.completed ? (
              <CheckCircle className="fill-blue-100" />
            ) : (
              <Circle />
            )}
            <span className="sr-only">Toggle Task</span>
          </Button>

          <span
            className={cn(
              "text-gray-700 transition-all",
              task.completed && "line-through text-gray-400",
            )}
          >
            {task.text}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => dispatch({ type: "START_EDIT", payload: task.id })}
          >
            <FilePen size={18} />
            <span className="sr-only">Edit Task</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDeleteTrigger(task.id)}
          >
            <Trash2 size={18} />
            <span className="sr-only">Delete Task</span>
          </Button>
        </div>
      </li>
    );
  },
);

TaskItem.displayName = "TaskItem";

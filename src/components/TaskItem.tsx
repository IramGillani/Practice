import { memo } from "react";
import { CheckCircle, Circle, FilePen, Trash2 } from "lucide-react";
import { type Task } from "../types";
import { Button } from "./ui/button";

export const TaskItem = memo(
  ({
    task,
    onToggle,
    onDelete,
    onEdit,
  }: {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
  }) => {
    return (
      <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group transition-all">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggle(task.id)}
            className="text-blue-500 hover:bg-transparent"
          >
            {task.completed ? (
              <CheckCircle className="h-5 w-5 fill-blue-100" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
          <span
            className={`text-gray-700 ${task.completed ? "line-through text-gray-400" : ""}`}
          >
            {task.text}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent"
          >
            <FilePen className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </li>
    );
  },
);

TaskItem.displayName = "TaskItem";

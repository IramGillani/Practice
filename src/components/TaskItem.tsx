import { memo } from "react";
import { CheckCircle, Circle, FilePen, Trash2 } from "lucide-react";
import type { Task } from "../App";

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
          <button onClick={() => onToggle(task.id)} className="text-blue-500">
            {task.completed ? (
              <CheckCircle className="fill-blue-100" />
            ) : (
              <Circle />
            )}
          </button>
          <span
            className={`text-gray-700 ${task.completed ? "line-through text-gray-400" : ""}`}
          >
            {task.text}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FilePen size={18} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </li>
    );
  },
);

TaskItem.displayName = "TaskItem";

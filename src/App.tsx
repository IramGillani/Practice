import { useState } from "react"; 
import { ArrowUpDown } from "lucide-react";
import { TaskItem } from "./components/TaskItem";
import { DeleteModal } from "./components/DeleteModal";
import TaskInput from "./components/TaskInput";
import { useTasks } from "./context/TodoProvider";
import type { FilterStatus } from "./types";

const TodoApp = () => {
  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    toggleTask,
    deleteTask,
    startEditing,
  } = useTasks();


  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

 
  const taskTextToDelete = tasks.find((t) => t.id === taskToDelete)?.text;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
        Task Manager
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-4 border-b">
        <div className="flex bg-gray-100 rounded-md p-1">
          {(["all", "active", "completed"] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-sm capitalize rounded-md transition-all ${
                filter === status
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowUpDown size={16} />
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>
      </div>

      <ul className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={() => setTaskToDelete(task.id)}
            onToggle={toggleTask}
            onEdit={startEditing}
          />
        ))}
      </ul>

      {filteredTasks.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No tasks found.</p>
      )}

      <TaskInput />

      {taskToDelete && (
        <DeleteModal
          taskText={taskTextToDelete || ""}
          onConfirm={() => {
            deleteTask(taskToDelete);
            setTaskToDelete(null);
          }}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
};

export default TodoApp;

import { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, ArrowUpDown, FilePenLine } from "lucide-react";
import { TaskItem } from "./components/TaskItem";
import { DeleteModal } from "./components/DeleteModal";
import type { Task, FilterStatus, SortOrder } from "./types";
import { processedTasks } from "./utils";
import TaskInput from "./components/TaskInput";

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todo-tasks");
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    //as all Dates turn into plain strings when loaded from localStorage

    return parsed.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    }));
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [updating, setUpdating] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (updating && editingId) {
      setTasks(
        tasks.map((t: Task) =>
          t.id === editingId ? { ...t, text: input } : t,
        ),
      );
      setUpdating(false);
      setEditingId(null);
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: input,
        completed: false,
        createdAt: new Date(),
      };
      setTasks([...tasks, newTask]);
    }
    setInput("");
  };

  const toggleTask = useCallback((id: string) => {
    setTasks((prev: Task[]) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev: Task[]) => prev.filter((t) => t.id !== id));
  }, []);

  const startEditing = useCallback((task: Task) => {
    setUpdating(true);
    setEditingId(task.id);
    setInput(task.text);
  }, []);

  const filteredTasks = useMemo(
    (): Task[] => processedTasks(tasks, filter, sortOrder),
    [tasks, filter, sortOrder],
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className=" text-center text-2xl font-bold text-gray-800 mb-6">
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

      {/* React hook form + Zod */}
      {/* <form onSubmit={handleSubmit} className="flex gap-2 mt-6">
        <input
          name="task"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={updating ? "Update task..." : "What needs to be done?"}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className={`${updating ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white p-2 rounded-lg transition-colors`}
        >
          {updating ? <FilePenLine size={20} /> : <Plus size={20} />}
        </button>
      </form> */}
      <TaskInput />
      {taskToDelete && (
        <DeleteModal
          taskText={tasks[taskToDelete]?.text}
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

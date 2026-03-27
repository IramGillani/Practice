import { Task, TaskState, FilterStatus, SortOrder } from "@/types";

type TaskAction =
  | { type: "ADD_TASK"; payload: string }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_FILTER"; payload: FilterStatus }
  | { type: "SET_SORT"; payload: SortOrder }
  | { type: "START_EDIT"; payload: string }
  | { type: "UPDATE_TASK"; payload: string }
  | { type: "LOAD_TASKS"; payload: Task[] };

export const taskReducer = (
  state: TaskState,
  action: TaskAction,
): TaskState => {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: crypto.randomUUID(),
            text: action.payload,
            completed: false,
            createdAt: new Date(),
          },
        ],
      };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t,
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_SORT":
      return { ...state, sortOrder: action.payload };
    case "START_EDIT":
      return { ...state, editingId: action.payload };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === state.editingId ? { ...t, text: action.payload } : t,
        ),
        editingId: null,
      };
    case "LOAD_TASKS":
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
};

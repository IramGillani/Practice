import type { Task, TaskState, FilterStatus, SortOrder } from "@/types";

export type TaskAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "SET_FILTER"; payload: FilterStatus }
  | { type: "SET_SORT"; payload: SortOrder }
  | { type: "START_EDIT"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" };

export const taskReducer = (
  state: TaskState,
  action: TaskAction,
): TaskState => {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
      };

    case "ADD_TASK":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload ? { ...t, completed: !t.completed } : t,
        ),
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t,
        ),
        editingId: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
        error: null,
      };

    case "SET_FILTER":
      return { ...state, filter: action.payload };

    case "SET_SORT":
      return { ...state, sortOrder: action.payload };

    case "START_EDIT":
      return { ...state, editingId: action.payload };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

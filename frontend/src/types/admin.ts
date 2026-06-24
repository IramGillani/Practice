import type { User } from "./Auth";
import type { Task } from "./Task";

export interface DashboardData {
  users: User[];
  tasks: Task[];
  stats: {
    data: { totalUsers: number; totalTasks: number; completedTasks: number };
  };
  userPagination: Pagination;
  taskPagination: Pagination;
}

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export interface PaginatedResponse<T> {
  data: T;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
export type UserTableProps = {
  users: User[];
  onDeleteUser: (id: string) => void;
};

export type TaskTableProps = {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
};

export type TabType = "Users" | "Tasks";

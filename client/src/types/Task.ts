export type FilterStatus = "all" | "completed" | "active";
export type SortOrder = "newest" | "oldest";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TaskState {
  tasks: Task[];
  filter: FilterStatus;
  sortOrder: SortOrder;
  editingId: string | null;
}
